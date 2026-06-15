provider "aws" {
  region = "us-east-1"
}

# 1. Virtual Private Cloud Setup
resource "aws_vpc" "nextgen_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Name = "nextgen-vpc"
  }
}

# Subnets
resource "aws_subnet" "public_1" {
  vpc_id            = aws_vpc.nextgen_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_2" {
  vpc_id            = aws_vpc.nextgen_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true
}

# 2. Amazon EKS Cluster (Elastic Kubernetes Service)
resource "aws_eks_cluster" "eks" {
  name     = "nextgen-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  }
}

resource "aws_iam_role" "eks_role" {
  name = "nextgen-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

# EKS Node Group
resource "aws_eks_node_group" "nodes" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "nextgen-node-group"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 2
  }

  instance_types = ["t3.medium"]
}

resource "aws_iam_role" "node_role" {
  name = "nextgen-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

# 3. Relational Database Service: PostgreSQL RDS Instance
resource "aws_db_instance" "postgres" {
  allocated_storage    = 100
  max_allocated_storage = 1000
  db_name              = "instagram_clone"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.large"
  username             = "postgres"
  password             = "instagram_secure_pass_2026"
  skip_final_snapshot  = true
  multi_az             = true
}

# 4. Amazon S3 Storage Bucket for CDN Assets
resource "aws_s3_bucket" "media_bucket" {
  bucket        = "nextgen-instagram-cdn-media"
  force_destroy = true
}

# 5. CloudFront CDN Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.media_bucket.bucket_regional_domain_name
    origin_id   = "S3-nextgen-instagram-cdn-media"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-nextgen-instagram-cdn-media"

    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
