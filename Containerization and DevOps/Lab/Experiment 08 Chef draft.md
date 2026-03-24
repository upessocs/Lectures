

# Experiment 8: Chef - Configuration Management

## Problem Statement

Managing infrastructure manually across multiple servers leads to configuration drift, inconsistent environments, and time-consuming repetitive tasks. While Ansible solves this with agentless SSH, Chef offers a **pull-based** approach where nodes regularly check in with a central server, ensuring continuous compliance even when network connections are intermittent.

## What is Chef?

Chef is an **automation platform** that transforms infrastructure into code using Ruby-based DSL (Domain Specific Language). It follows a **pull-based model** where agents (Chef clients) periodically pull configurations from a central Chef server.

> **Key Difference from Ansible**: Chef requires an agent on managed nodes and a central server, but offers more powerful dependency management and scales better for large enterprises.


**How Chef Solves the Problem:**
- **Pull-based Model**: Nodes check in with Chef server regularly, ensuring consistent state
- **Idempotent Resources**: Resources ensure desired state regardless of how many times applied
- **Infrastructure as Code**: All configurations version-controlled and testable
- **Community Cookbooks**: Reusable configurations for common applications

**Key Concepts:**
- **Chef Server**: Central repository for cookbooks, policies, and node data
- **Chef Workstation**: Development machine where cookbooks are created and tested
- **Chef Node**: Managed machine with Chef client installed
- **Cookbook**: Collection of recipes, attributes, templates, and files
- **Recipe**: Ruby-based file containing resource declarations
- **Resource**: Building blocks (package, service, file, template, etc.)
- **Run List**: Ordered list of recipes applied to a node
- **Ohai**: System profiling tool that collects node attributes


### How Chef Works

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHEF ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WORKSTATION              CHEF SERVER           MANAGED NODES   │
│  ┌────────────────┐       ┌─────────────┐       ┌────────────┐  │
│  │ Cookbooks      │──knife─▶│             │       │            │  │
│  │ Roles          │         │  Cookbook   │       │  Chef      │  │
│  │ Data Bags      │         │  Repository │       │  Client    │  │
│  └────────────────┘         │             │       │            │  │
│         │                   └─────────────┘       └────────────┘  │
│         │                          ▲                     │        │
│         │                          │                     │        │
│         │                          │   Pull (Every 30m)  │        │
│         │                          └─────────────────────┘        │
│         │                                                         │
│         └─────────── Upload ──────────────────────────────────────┘
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Benefits of Chef

- **Pull-based Architecture**: Nodes check in regularly, ensuring compliance
- **Powerful Ruby DSL**: More expressive than YAML for complex logic
- **Large Community**: 4000+ community cookbooks
- **Test Kitchen**: Built-in testing framework
- **Compliance**: Continuous auditing capabilities

---

## Part A: Chef Solo (Simpler - No Server Required)

### Architecture (No Server)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHEF SOLO ARCHITECTURE                       │
│                                                                  │
│  CONTROL NODE (Your Machine)         MANAGED NODES              │
│  ┌────────────────────────┐          ┌────────────────────┐     │
│  │ Cookbooks              │          │                    │     │
│  │ Recipes                │──scp/ssh─▶│  Chef Client      │     │
│  │ Attributes             │          │  (Local Mode)     │     │
│  │ Templates              │          │                    │     │
│  └────────────────────────┘          └────────────────────┘     │
│                                                                  │
│  No central server needed - runs in local mode                   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Install Chef Workstation

```bash
# Ubuntu/Debian installation
wget https://packages.chef.io/files/stable/chef-workstation/24.10.1144/ubuntu/22.04/chef-workstation_24.10.1144-1_amd64.deb
sudo dpkg -i chef-workstation_24.10.1144-1_amd64.deb

# Verify installation
chef --version
# Expected: Chef Workstation version: 24.10.1144

# Install Chef Client on managed nodes (Docker containers)
docker exec server1 apt-get update
docker exec server1 apt-get install -y curl
docker exec server1 curl -L https://omnitruck.chef.io/install.sh | bash
```

### Step 2: Setup Lab Environment (Docker Containers)

```bash
# Create network
docker network create chef-lab

# Create SSH key pair (if not exists)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/chef-key -N ""

# Build Chef-ready Docker image
cat > Dockerfile.chef << 'EOF'
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
        python3 \
        openssh-server \
        sudo \
        curl \
        systemd && \
    apt-get clean

# Configure SSH
RUN mkdir -p /var/run/sshd && \
    echo 'root:chef' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Setup SSH keys
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh
COPY ~/.ssh/chef-key.pub /root/.ssh/authorized_keys
RUN chmod 600 /root/.ssh/authorized_keys

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
EOF

# Build image
docker build -f Dockerfile.chef -t chef-node .

# Create 4 test nodes
for i in {1..4}; do
  docker run -d \
    --name node${i} \
    --network chef-lab \
    -p 222${i}:22 \
    chef-node
  echo "Node${i} created with SSH on port 222${i}"
done

# Copy SSH key to nodes
for i in {1..4}; do
  docker exec node${i} mkdir -p /root/.ssh
  docker cp ~/.ssh/chef-key.pub node${i}:/root/.ssh/authorized_keys
  docker exec node${i} chmod 600 /root/.ssh/authorized_keys
done
```

### Step 3: Create First Cookbook

```bash
# Create cookbook directory
mkdir -p ~/chef-repo/cookbooks
cd ~/chef-repo

# Generate cookbook
chef generate cookbook cookbooks/basics

# Edit cookbook metadata
cat > cookbooks/basics/metadata.rb << 'EOF'
name 'basics'
maintainer 'DevOps Lab'
maintainer_email 'lab@example.com'
license 'Apache-2.0'
description 'Installs/Configures basic system settings'
version '0.1.0'
chef_version '>= 16.0'

# Dependencies
depends 'apt'
EOF
```

### Step 4: Create Recipes

```bash
# Default recipe - includes other recipes
cat > cookbooks/basics/recipes/default.rb << 'EOF'
#
# Cookbook:: basics
# Recipe:: default
#
include_recipe 'basics::packages'
include_recipe 'basics::files'
include_recipe 'basics::services'
EOF

# Packages recipe
cat > cookbooks/basics/recipes/packages.rb << 'EOF'
#
# Cookbook:: basics
# Recipe:: packages
#

# Update apt cache
apt_update 'update' do
  action :update
  frequency 86400
end

# Install essential packages
%w(vim htop wget curl git net-tools).each do |pkg|
  package pkg do
    action :install
  end
end

# Install specific version of Python
package 'python3' do
  action :install
  version '3.10.*'
end
EOF

# Files recipe
cat > cookbooks/basics/recipes/files.rb << 'EOF'
#
# Cookbook:: basics
# Recipe:: files
#

# Create test directory
directory '/opt/chef-demo' do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

# Create file with content using template
file '/opt/chef-demo/README.md' do
  content <<~EOH
    # Chef Managed System
    ======================
    Hostname: #{node['hostname']}
    IP Address: #{node['ipaddress']}
    OS: #{node['platform']} #{node['platform_version']}
    Managed by: Chef
    Last Converged: #{Time.now}
  EOH
  mode '0644'
  action :create
end

# Copy file from cookbook
cookbook_file '/opt/chef-demo/welcome.txt' do
  source 'welcome.txt'
  mode '0644'
  action :create
end
EOF

# Services recipe
cat > cookbooks/basics/recipes/services.rb << 'EOF'
#
# Cookbook:: basics
# Recipe:: services
#

# Ensure SSH is running
service 'ssh' do
  action [:enable, :start]
end

# Create a custom systemd service
template '/etc/systemd/system/demo.service' do
  source 'demo.service.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :run, 'execute[systemctl daemon-reload]', :immediately
end

execute 'systemctl daemon-reload' do
  command 'systemctl daemon-reload'
  action :nothing
end

service 'demo' do
  action [:enable, :start]
  subscribes :restart, 'template[/etc/systemd/system/demo.service]'
end
EOF
```

### Step 5: Create Templates and Files

```bash
# Create service template
cat > cookbooks/basics/templates/demo.service.erb << 'EOF'
[Unit]
Description=Chef Demo Service
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'while true; do echo "Chef Demo Service: $(date)" >> /var/log/demo.log; sleep 60; done'
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOF

# Create welcome file
cat > cookbooks/basics/files/welcome.txt << 'EOF'
=====================================
  Welcome to Chef Managed System
=====================================
This system is configured using Chef.
All changes should be made through cookbooks.
=====================================
EOF
```

### Step 6: Create Node Inventory

```bash
# Create nodes file for Chef Solo
cat > nodes.json << 'EOF'
{
  "node1": {
    "run_list": ["recipe[basics]"]
  },
  "node2": {
    "run_list": ["recipe[basics]"]
  },
  "node3": {
    "run_list": ["recipe[basics]"]
  },
  "node4": {
    "run_list": ["recipe[basics]"]
  }
}
EOF

# Create client configuration
mkdir -p ~/chef-repo/.chef

cat > ~/chef-repo/.chef/config.rb << 'EOF'
current_dir = File.dirname(__FILE__)
node_name 'workstation'
client_key "#{current_dir}/workstation.pem"
chef_repo_path "#{current_dir}/.."
cookbook_path ["#{current_dir}/../cookbooks"]
EOF

# Create a script to run Chef Solo on nodes
cat > ~/chef-repo/run-chef.sh << 'EOF'
#!/bin/bash

# Run Chef Solo on all nodes
for i in {1..4}; do
  echo "====================================="
  echo "Configuring node${i}"
  echo "====================================="
  
  # Copy cookbooks to node
  ssh -i ~/.ssh/chef-key -o StrictHostKeyChecking=no root@localhost -p 222${i} "mkdir -p /opt/chef"
  scp -i ~/.ssh/chef-key -P 222${i} -r ~/chef-repo/cookbooks root@localhost:/opt/chef/
  
  # Run Chef Solo
  ssh -i ~/.ssh/chef-key -p 222${i} root@localhost << 'ENDSSH'
    cd /opt/chef
    chef-client --local-mode --runlist 'recipe[basics]'
ENDSSH
  
  echo "Node${i} configured successfully"
done
EOF

chmod +x ~/chef-repo/run-chef.sh
```

### Step 7: Run Chef Solo

```bash
# Execute configuration
cd ~/chef-repo
./run-chef.sh

# Verify changes on nodes
for i in {1..4}; do
  echo "=== Node${i} ==="
  ssh -i ~/.ssh/chef-key -p 222${i} root@localhost "cat /opt/chef-demo/README.md"
  echo ""
done
```

---

## Part B: Chef Server (Full Enterprise Setup)

### Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CHEF SERVER ARCHITECTURE                               │
│                                                                              │
│  WORKSTATION              CHEF SERVER                MANAGED NODES          │
│  ┌──────────────┐        ┌──────────────────┐       ┌──────────────┐       │
│  │ Cookbooks    │──knife─▶│                  │       │              │       │
│  │ Roles        │         │  Chef Server    │       │  Chef Client │       │
│  │ Environments │         │  (Port 443)     │       │  (Agent)     │       │
│  │ Data Bags    │         │                  │       │              │       │
│  └──────────────┘         └──────────────────┘       └──────────────┘       │
│         │                          ▲                        │                │
│         │                          │                        │                │
│         │                          │   Pull (Every 30m)    │                │
│         │                          └────────────────────────┘                │
│         │                                                                   │
│         └─────────── Upload ────────────────────────────────────────────────┘
│                                                                              │
│  Server stores:                                                              │
│  - Cookbooks (versioned)                                                     │
│  - Node data (attributes, run lists)                                         │
│  - Client authentication keys                                                │
│  - Search indexes                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Setup Chef Server

```bash
# Pull Chef Server Docker image
docker pull chef/chef-server:latest

# Run Chef Server
docker run -d \
  --name chef-server \
  --network chef-lab \
  -p 443:443 \
  -v chef-server-data:/var/opt/opscode \
  chef/chef-server:latest

# Wait for Chef Server to start (2-3 minutes)
docker logs -f chef-server

# Create admin user
docker exec chef-server chef-server-ctl user-create \
  admin "Admin" "User" admin@example.com 'admin123' \
  --filename /tmp/admin.pem

# Create organization
docker exec chef-server chef-server-ctl org-create \
  devops "DevOps Lab" --association admin \
  --filename /tmp/devops-validator.pem

# Copy keys to workstation
docker cp chef-server:/tmp/admin.pem ~/chef-repo/.chef/
docker cp chef-server:/tmp/devops-validator.pem ~/chef-repo/.chef/

# Install Chef Workstation (if not already)
# (Follow Part A Step 1)
```

### Step 2: Configure Knife

```bash
# Configure knife.rb for Chef Server
cat > ~/chef-repo/.chef/knife.rb << 'EOF'
current_dir = File.dirname(__FILE__)
log_level                :info
log_location             STDOUT
node_name                "admin"
client_key               "#{current_dir}/admin.pem"
validation_client_name   "devops-validator"
validation_key           "#{current_dir}/devops-validator.pem"
chef_server_url          "https://chef-server/organizations/devops"
cookbook_path            ["#{current_dir}/../cookbooks"]
ssl_verify_mode          :verify_none
EOF

# Test connection
cd ~/chef-repo
knife ssl check
knife client list
```

### Step 3: Create Advanced Cookbook

```bash
# Generate webapp cookbook
chef generate cookbook cookbooks/webapp

# Create web server recipe
cat > cookbooks/webapp/recipes/default.rb << 'EOF'
#
# Cookbook:: webapp
# Recipe:: default
#

include_recipe 'webapp::webserver'
include_recipe 'webapp::app'
EOF

# Web server recipe
cat > cookbooks/webapp/recipes/webserver.rb << 'EOF'
#
# Cookbook:: webapp
# Recipe:: webserver
#

# Install Nginx
package 'nginx' do
  action :install
end

# Configure Nginx
template '/etc/nginx/sites-available/webapp' do
  source 'webapp.conf.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :reload, 'service[nginx]'
end

# Enable site
link '/etc/nginx/sites-enabled/webapp' do
  to '/etc/nginx/sites-available/webapp'
  notifies :reload, 'service[nginx]'
end

# Remove default site
file '/etc/nginx/sites-enabled/default' do
  action :delete
  notifies :reload, 'service[nginx]'
end

service 'nginx' do
  action [:enable, :start]
end
EOF

# Application recipe
cat > cookbooks/webapp/recipes/app.rb << 'EOF'
#
# Cookbook:: webapp
# Recipe:: app
#

# Install Node.js
apt_repository 'nodejs' do
  uri 'https://deb.nodesource.com/node_16.x'
  components ['main']
  key 'https://deb.nodesource.com/gpgkey/nodesource.gpg.key'
  action :add
end

package 'nodejs' do
  action :install
end

# Create app directory
directory '/opt/webapp' do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

# Deploy application
git '/opt/webapp' do
  repository 'https://github.com/chef-training/sample-node-app.git'
  revision 'main'
  action :sync
  notifies :run, 'execute[npm install]', :immediately
end

# Install dependencies
execute 'npm install' do
  cwd '/opt/webapp'
  command 'npm install --production'
  action :nothing
end

# Create systemd service
template '/etc/systemd/system/webapp.service' do
  source 'webapp.service.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :run, 'execute[systemctl daemon-reload]', :immediately
  notifies :restart, 'service[webapp]'
end

execute 'systemctl daemon-reload' do
  command 'systemctl daemon-reload'
  action :nothing
end

service 'webapp' do
  action [:enable, :start]
end
EOF
```

### Step 4: Create Templates

```bash
# Nginx template
cat > cookbooks/webapp/templates/webapp.conf.erb << 'EOF'
server {
    listen 80;
    server_name <%= node['hostname'] %>;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Webapp service template
cat > cookbooks/webapp/templates/webapp.service.erb << 'EOF'
[Unit]
Description=Node.js Web Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/webapp
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
```

### Step 5: Bootstrap Nodes

```bash
# Prepare nodes with Chef Client
for i in {1..4}; do
  # Install Chef Client
  docker exec node${i} curl -L https://omnitruck.chef.io/install.sh | bash
  
  # Copy validator key
  docker cp ~/chef-repo/.chef/devops-validator.pem node${i}:/etc/chef/
  
  # Create client config
  docker exec node${i} bash -c "cat > /etc/chef/client.rb << 'EOF'
log_level :info
log_location STDOUT
chef_server_url 'https://chef-server/organizations/devops'
validation_client_name 'devops-validator'
validation_key '/etc/chef/devops-validator.pem'
node_name 'node${i}'
ssl_verify_mode :verify_none
EOF"
done
```

### Step 6: Upload Cookbook and Bootstrap

```bash
# Upload cookbook to Chef Server
cd ~/chef-repo
knife cookbook upload webapp

# Bootstrap nodes
for i in {1..4}; do
  knife bootstrap localhost \
    --ssh-user root \
    --ssh-port 222${i} \
    --ssh-identity-file ~/.ssh/chef-key \
    --node-name node${i} \
    --run-list 'recipe[webapp]'
done

# List nodes
knife node list
knife status
```

### Step 7: Verify Configuration

```bash
# Check node details
knife node show node1

# Search for nodes
knife search node "platform:ubuntu"

# Run Chef on specific node
knife ssh "name:node1" "chef-client" \
  --ssh-user root \
  --ssh-identity-file ~/.ssh/chef-key \
  --attribute ipaddress

# Verify web application
for i in {1..4}; do
  echo "=== Node${i} ==="
  curl -s http://localhost:222${i} || echo "Service not accessible"
done
```

---

## Comparison: Chef Solo vs Chef Server

| Aspect | Chef Solo (Part A) | Chef Server (Part B) |
|--------|-------------------|---------------------|
| **Complexity** | Low | High |
| **Setup Time** | 15 minutes | 45 minutes |
| **Server Required** | No | Yes |
| **Scalability** | Manual per node | Centralized |
| **Node Management** | Direct SSH | Chef Server |
| **Search Capabilities** | No | Yes |
| **Role-Based Config** | Limited | Full support |
| **Best For** | Learning, small setups | Production, enterprises |

---

## Chef vs Ansible Comparison

| Feature | Chef | Ansible |
|---------|------|---------|
| **Architecture** | Pull-based (agent) | Push-based (agentless) |
| **Language** | Ruby DSL | YAML |
| **Learning Curve** | Steep | Gentle |
| **Setup Complexity** | High | Low |
| **Idempotency** | Yes | Yes |
| **Real-time Changes** | Delayed (pull interval) | Immediate (push) |
| **Scaling** | Excellent (5000+ nodes) | Good (up to 2000 nodes) |
| **Community** | Mature, 4000+ cookbooks | Largest, 3000+ collections |
| **Use Case** | Large enterprises | Small to medium, cloud |

---

## Quick Commands Reference

### Chef Solo
```bash
# Generate cookbook
chef generate cookbook my_cookbook

# Run Chef Solo
chef-client --local-mode --runlist 'recipe[my_cookbook]'

# Run with JSON attributes
chef-client --local-mode --json-attributes nodes.json
```

### Chef Server
```bash
# Upload cookbook
knife cookbook upload my_cookbook

# List nodes
knife node list

# Bootstrap node
knife bootstrap IP --ssh-user root --node-name node1 --run-list 'recipe[my_cookbook]'

# SSH to nodes
knife ssh "name:node*" "uptime" --ssh-user root

# Show node details
knife node show node1
```

### Cleanup
```bash
# Stop and remove containers
for i in {1..4}; do docker rm -f node${i}; done
docker rm -f chef-server

# Remove Chef data
rm -rf ~/chef-repo
```

---

## References

- Official Website: **[https://www.chef.io](https://www.chef.io)**
- Documentation: **[https://docs.chef.io](https://docs.chef.io)**
- Chef Supermarket: **[https://supermarket.chef.io](https://supermarket.chef.io)**
- Learn Chef: **[https://learn.chef.io](https://learn.chef.io)**




---

# Optional Part C

### Hands-on Lab Setup

#### Lab Architecture
```
┌─────────────────┐     HTTPS     ┌──────────────────┐
│  Chef           │──────────────▶│  Chef Server     │
│  Workstation    │               │  (Container)     │
└─────────────────┘               └──────────────────┘
        │                                │
        │                                │ HTTPS (Pull)
        ▼                                ▼
┌─────────────────┐               ┌──────────────────┐
│  Chef           │◀──────────────│  Managed Nodes   │
│  Repo (Git)     │               │  (Web/DB/LB)     │
└─────────────────┘               └──────────────────┘
```

#### Step 1: Setup Chef Environment

```bash
# Create Docker network
docker network create chef-lab

# Start Chef Server (using Chef's official Docker image)
docker run -d \
  --name chef-server \
  --network chef-lab \
  -p 443:443 \
  -v chef-server-data:/var/opt/opscode \
  chef/chef-server:latest

# Wait for Chef Server to start (about 2-3 minutes)
docker logs -f chef-server

# Create Chef Workstation
docker run -d \
  --name chef-workstation \
  --network chef-lab \
  -v chef-workstation:/root \
  chef/chef-workstation:latest \
  sleep infinity

# Create managed nodes
docker run -d --name chef-node-web --network chef-lab ubuntu:22.04 sleep infinity
docker run -d --name chef-node-db --network chef-lab ubuntu:22.04 sleep infinity
docker run -d --name chef-node-lb --network chef-lab ubuntu:22.04 sleep infinity

# Install Chef Client on managed nodes
for node in chef-node-web chef-node-db chef-node-lb; do
  docker exec $node bash -c "apt-get update && apt-get install -y curl"
  docker exec $node bash -c "curl -L https://omnitruck.chef.io/install.sh | bash -s -- -v 17"
done
```

#### Step 2: Configure Chef Server

```bash
# Enter Chef Workstation
docker exec -it chef-workstation bash

# Generate admin key and user
cd /root
chef-server-ctl user-create admin "Admin" "User" admin@example.com 'admin123' --filename admin.pem
chef-server-ctl org-create lab "DevOps Lab" --association admin --filename lab-validator.pem

# Copy the validation key to workstation
mkdir -p /root/.chef
cp /root/lab-validator.pem /root/.chef/
cp /root/admin.pem /root/.chef/

# Create knife.rb configuration
cat > /root/.chef/knife.rb << 'EOF'
current_dir = File.dirname(__FILE__)
log_level                :info
log_location             STDOUT
node_name                "admin"
client_key               "#{current_dir}/admin.pem"
validation_client_name   "lab-validator"
validation_key           "#{current_dir}/lab-validator.pem"
chef_server_url          "https://chef-server/organizations/lab"
cookbook_path            ["#{current_dir}/../cookbooks"]
EOF
```

#### Step 3: Create Chef Cookbook

```bash
# Navigate to cookbook directory
cd /root
mkdir -p cookbooks
cd cookbooks

# Generate cookbook
chef generate cookbook webapp

# Edit metadata.rb
cat > webapp/metadata.rb << 'EOF'
name 'webapp'
maintainer 'DevOps Lab'
maintainer_email 'admin@example.com'
license 'All Rights Reserved'
description 'Installs/Configures webapp'
version '0.1.0'
chef_version '>= 16.0'

depends 'nginx'
depends 'nodejs'
EOF
```

#### Step 4: Create Recipes

```bash
# Create default recipe
cat > webapp/recipes/default.rb << 'EOF'
#
# Cookbook:: webapp
# Recipe:: default
#

include_recipe 'webapp::webserver'
EOF

# Create webserver recipe
cat > webapp/recipes/webserver.rb << 'EOF'
#
# Cookbook:: webapp
# Recipe:: webserver
#

# Install Node.js and npm
nodejs_install 'nodejs' do
  version '14'
  action :install
end

# Create application directory
directory '/opt/webapp' do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

# Clone application repository
git '/opt/webapp' do
  repository 'https://github.com/yourusername/sample-webapp.git'
  revision 'main'
  action :sync
end

# Install npm dependencies
execute 'npm install' do
  cwd '/opt/webapp'
  command 'npm install --production'
  action :run
end

# Create systemd service
template '/etc/systemd/system/webapp.service' do
  source 'webapp.service.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :run, 'execute[systemctl daemon-reload]', :immediately
  notifies :restart, 'service[webapp]', :delayed
end

# Start and enable service
service 'webapp' do
  action [:enable, :start]
end

# Install and configure nginx
package 'nginx' do
  action :install
end

template '/etc/nginx/sites-available/webapp' do
  source 'nginx-site.conf.erb'
  owner 'root'
  group 'root'
  mode '0644'
  notifies :reload, 'service[nginx]'
end

nginx_site 'webapp' do
  action :enable
end

service 'nginx' do
  action [:enable, :start]
end

# Execute systemctl daemon-reload
execute 'systemctl daemon-reload' do
  command 'systemctl daemon-reload'
  action :nothing
end
EOF
```

#### Step 5: Create Templates

```bash
# Create webapp service template
cat > webapp/templates/webapp.service.erb << 'EOF'
[Unit]
Description=Sample Web Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/webapp
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Create nginx configuration template
cat > webapp/templates/nginx-site.conf.erb << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

#### Step 6: Bootstrap Nodes

```bash
# Install community cookbooks dependencies
cd /root/cookbooks
chef exec berks install
chef exec berks vendor

# Bootstrap web nodes
knife bootstrap chef-node-web \
  --ssh-user root \
  --sudo \
  --node-name web-node-01 \
  --run-list 'recipe[webapp]'

knife bootstrap chef-node-db \
  --ssh-user root \
  --sudo \
  --node-name db-node-01 \
  --run-list 'recipe[webapp::database]'

# Verify nodes
knife node list
knife status
```