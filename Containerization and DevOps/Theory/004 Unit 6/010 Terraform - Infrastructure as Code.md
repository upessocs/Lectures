# Terraform - Infrastructure as Code

## 1. The Problem: Infrastructure Chaos

In traditional operations, creating servers involved manual steps: clicking through a cloud console, configuring resources by hand, and keeping no record of what was done. This approach leads to several problems:

- Environments are not reproducible
- Human error is common
- No version control for infrastructure
- Scaling requires repetitive manual work

Terraform solves these problems by letting you define your entire infrastructure in code files, which can be versioned, reviewed, and reused.

## 2. What Terraform Does

Terraform is an open-source Infrastructure as Code (IaC) tool created by HashiCorp. It allows you to define resources like servers, databases, and networking components using a declarative configuration language called HCL (HashiCorp Configuration Language).

Core capabilities:

- Desired state management: You declare what you want, Terraform figures out how to achieve it
- Execution planning: `terraform plan` shows exactly what will change before you apply it
- State tracking: Terraform maintains a state file (`terraform.tfstate`) that maps your code to real-world resources
- Resource graph: Terraform builds a dependency graph and creates or updates resources in the correct order

## 3. Terraform vs Ansible: Critical Distinction

Many beginners confuse these tools because they overlap slightly. Understanding their different purposes is essential.

| Aspect | Terraform | Ansible |
|--------|-----------|---------|
| Primary purpose | Create and manage infrastructure | Configure systems and deploy applications |
| Level of operation | Cloud APIs, infrastructure resources | Operating system, applications, services |
| State management | Maintains a state file | Stateless - no tracking of what was created |
| Approach | Declarative (what) | Mostly procedural (how) |
| Typical scope | VPCs, EC2 instances, load balancers, databases | Installing packages, config files, starting services |

**Timeline and typical workflow:**

1. Terraform provisions the raw infrastructure (servers, networks, storage)
2. Ansible configures that infrastructure (install software, set up users, deploy configs)

**Example to clarify:**

- Terraform: "Create an EC2 instance with a specific AMI and size"
- Ansible: "Install nginx and copy my application code onto that EC2 instance"

**Can Ansible replace Terraform?** No, in real-world DevOps. While Ansible can create EC2 instances using modules, it lacks proper state management, doesn't track lifecycle, and becomes unmanageable at scale. Possible is not the same as recommended.


<svg width="950" height="320" xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="#0f172a"/>

  <!-- Dev Machine -->
  <rect x="50" y="110" width="200" height="100" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="150" y="140" text-anchor="middle" fill="#e2e8f0" font-size="14">Developer</text>
  <text x="150" y="160" text-anchor="middle" fill="#94a3b8" font-size="12">Terraform Code</text>
  <text x="150" y="180" text-anchor="middle" fill="#94a3b8" font-size="12">(.tf files)</text>

  <!-- Terraform -->
  <rect x="320" y="100" width="200" height="120" rx="10" fill="#1e293b" stroke="#7c3aed" stroke-width="2"/>
  <text x="420" y="135" text-anchor="middle" fill="#e2e8f0" font-size="14">Terraform</text>
  <text x="420" y="155" text-anchor="middle" fill="#94a3b8" font-size="12">Plan & Apply</text>
  <text x="420" y="175" text-anchor="middle" fill="#94a3b8" font-size="12">State File</text>

  <!-- Cloud -->
  <rect x="620" y="80" width="250" height="160" rx="12" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
  <text x="745" y="110" text-anchor="middle" fill="#e2e8f0" font-size="14">Cloud (AWS/Azure/GCP)</text>

  <!-- Resources -->
  <rect x="650" y="130" width="80" height="40" rx="6" fill="#22c55e"/>
  <text x="690" y="155" text-anchor="middle" fill="white" font-size="11">EC2</text>

  <rect x="750" y="130" width="80" height="40" rx="6" fill="#22c55e"/>
  <text x="790" y="155" text-anchor="middle" fill="white" font-size="11">VPC</text>

  <rect x="700" y="180" width="80" height="40" rx="6" fill="#22c55e"/>
  <text x="740" y="205" text-anchor="middle" fill="white" font-size="11">DB</text>

  <!-- Arrows -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#e2e8f0"/>
    </marker>
  </defs>

  <!-- Dev -> Terraform -->
  <line x1="250" y1="160" x2="320" y2="160" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="285" y="150" fill="#a855f7" font-size="11">terraform apply</text>

  <!-- Terraform -> Cloud -->
  <line x1="520" y1="160" x2="620" y2="160" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="570" y="150" fill="#7c3aed" font-size="11">Cloud APIs</text>

</svg>




# What It Shows

```text
Dev → Terraform → Cloud → Infra Created
```

* Terraform talks to **cloud APIs**
* Creates:

  * Servers
  * Networks
  * Databases

No configuration inside servers yet

---

Terraform + Ansible (Real DevOps Flow)

<svg width="1100" height="360" xmlns="http://www.w3.org/2000/svg">

  <rect width="100%" height="100%" fill="#0f172a"/>

  <!-- Dev -->
  <rect x="40" y="130" width="180" height="100" rx="10" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
  <text x="130" y="160" text-anchor="middle" fill="#e2e8f0" font-size="14">Developer</text>
  <text x="130" y="180" text-anchor="middle" fill="#94a3b8" font-size="12">IaC + Playbooks</text>

  <!-- Terraform -->
  <rect x="260" y="120" width="200" height="120" rx="10" fill="#1e293b" stroke="#7c3aed" stroke-width="2"/>
  <text x="360" y="150" text-anchor="middle" fill="#e2e8f0" font-size="14">Terraform</text>
  <text x="360" y="170" text-anchor="middle" fill="#94a3b8" font-size="12">Provision Infra</text>

  <!-- Cloud Infra -->
  <rect x="500" y="100" width="250" height="160" rx="12" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>
  <text x="625" y="130" text-anchor="middle" fill="#e2e8f0" font-size="14">Cloud Infrastructure</text>

  <!-- EC2 -->
  <rect x="540" y="160" width="120" height="60" rx="8" fill="#22c55e"/>
  <text x="600" y="190" text-anchor="middle" fill="white" font-size="12">EC2 Instance</text>

  <!-- Ansible -->
  <rect x="800" y="120" width="200" height="120" rx="10" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
  <text x="900" y="150" text-anchor="middle" fill="#e2e8f0" font-size="14">Ansible</text>
  <text x="900" y="170" text-anchor="middle" fill="#94a3b8" font-size="12">Configure Server</text>
  <text x="900" y="190" text-anchor="middle" fill="#94a3b8" font-size="12">Install Apps</text>

  <!-- Arrows -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#e2e8f0"/>
    </marker>
  </defs>

  <!-- Dev -> Terraform -->
  <line x1="220" y1="180" x2="260" y2="180" stroke="#a855f7" stroke-width="2" marker-end="url(#arrow)"/>

  <!-- Terraform -> Cloud -->
  <line x1="460" y1="180" x2="500" y2="180" stroke="#7c3aed" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="480" y="165" fill="#7c3aed" font-size="11">Create Infra</text>

  <!-- Ansible -> EC2 -->
  <line x1="800" y1="180" x2="660" y2="190" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="720" y="170" fill="#f59e0b" font-size="11">SSH Configure</text>

</svg>


# What This Explains (Very Important)

## Flow:

```text
Terraform → creates infrastructure  
Ansible → configures infrastructure
```



# Key Insight 

### Terraform

* Talks to cloud APIs
* Creates:

  * EC2
  * VPC
  * DB



### Ansible

* Connects via SSH
* Installs:

  * Nginx
  * Docker
  * App code


```text
Terraform = Infrastructure (build)
Ansible = Configuration (setup inside)
```



---
## 4. Licensing: What Is Open Source and What Is Paid

Terraform itself is open-source under the Business Source License (BSL). The core CLI and basic providers (AWS, Azure, GCP, etc.) are free to use.

HashiCorp offers paid products that add enterprise features:

- Terraform Cloud (free tier available): Remote state storage, team collaboration, policy as code
- Terraform Enterprise: Self-hosted version with SSO, audit logging, and advanced governance

For learning and most production use, the open-source version is sufficient.

## 5. Installation

**Linux / macOS / Windows WSL:**

```bash
# Download the latest version (replace version as needed)
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip

# Unzip and move to PATH
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verify installation
terraform --version
```

**macOS with Homebrew:**

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

**Windows with Chocolatey:**

```powershell
choco install terraform
```

## 6. Required Credentials and IAM Setup

Terraform does not log in like a human user. It authenticates to cloud providers using API credentials.

### For AWS (most common for learning)

**Step 1: One-time manual setup**

1. Create an AWS account (if you don't have one)
2. Create an IAM user (never use the root account)
   - Enable programmatic access
   - For learning, attach the `AdministratorAccess` policy
   - For production, use least-privilege custom policies
3. Generate access keys (Access Key ID and Secret Access Key)


> Install AWS CLI not done earlier

```bash
sudo apt update && sudo apt install -y unzip curl && \
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
unzip -q awscliv2.zip && \
sudo ./aws/install && \
aws --version
```

**Step 2: Configure credentials on your local machine**

```bash
aws configure
# Enter your Access Key ID and Secret Access Key when prompted
```

**Step 3: Verify Terraform can use these credentials**

Terraform automatically reads from:
- AWS CLI configuration (`~/.aws/credentials`)
- Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)

**Common beginner mistakes to avoid:**

- Never hardcode credentials in Terraform files
- Never use the root account for Terraform operations
- Do not commit `.tfstate` files to version control (they may contain secrets)

## 7. Hands-On Example: Launch an EC2 Instance

This example assumes you have AWS credentials configured.

**Step 1: Create a working directory**

```bash
mkdir terraform-demo
cd terraform-demo
```

**Step 2: Create `main.tf`**

```hcl
# Configure the AWS provider
provider "aws" {
  region = "us-east-1"
}

# Create a security group that allows SSH and HTTP
resource "aws_security_group" "web_sg" {
  name        = "web-sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an EC2 instance
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 in us-east-1
  instance_type = "t2.micro"

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "terraform-demo-instance"
  }
}

# Output the public IP after creation
output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
```

**Step 3: Initialize Terraform**

```bash
terraform init
```
This downloads the AWS provider plugin.

**Step 4: See what Terraform will do**

```bash
terraform plan
```

**Step 5: Apply the configuration**

```bash
terraform apply
# Type "yes" when prompted
```

**Step 6: Clean up (important to avoid charges)**

```bash
terraform destroy
# Type "yes" when prompted
```

## 8. Mental Model Summary

- Terraform = "Build the house" (foundation, walls, roof)
- Ansible = "Furnish the house" (paint, furniture, appliances)
- IAM = "Keys and permissions" (who can do what)
- Terraform is infrastructure. Ansible is configuration. Use both.


