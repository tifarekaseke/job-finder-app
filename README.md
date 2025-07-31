# Job Finder App

A simple, Dockerized job discovery app that allows users to search for job listings based on a keyword or location. Built using HTML, CSS, and JavaScript, this app uses an external job API to fetch listings and presents them in a user-friendly interface.

## ✨ Features

-  Job Search by keyword and location  
-  Uses an external API for real-time job listings  ( https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch/playground/endpoint_73845d59-2a15-4a88-92c5-e9b1bc90956d )
-  Dockerized and runs in containers  
-  Supports load balancing across two containers using HAProxy  
-  Built-in error handling for unavailable API responses  
-  Easily deployable on multi-container environments

  💬 Challenges & Learnings
Load balancing: Configuring HAProxy required inspecting IP addresses from Docker networks.

API Integration: Managing API key security and rate limits was crucial.

Deployment: Deploying on multiple web servers taught valuable DevOps practices.

 Credits
Thanks to Letscrape JSearch API for the job listings API.

Docker and HAProxy documentation for deployment support.

---

🔀 Branch Note
Note: This repository uses master as the default branch instead of main. All source code, Docker configurations, and deployment steps are located in the master branch. Please make sure to reference master when reviewing or cloning this project.

## 🌐 Live Deployment
Accessible via: `http://<your_lb01_public_ip>:8082`

---

##  Load Balancer Logs (HAProxy Round-Robin Verification)

This screenshot shows requests being served alternately by both web01 and web02 via HAProxy:

![HAProxy Logs](./Screenshot%202025-07-31%20113206.png)

---

## 🐳 Docker Image Details

- Docker Hub Repo: [https://hub.docker.com/r/tifarekaseke/job-finder-app](https://hub.docker.com/r/tifarekaseke/job-finder-app)
- Image Name: `tifarekaseke/job-finder-app`
- Tag: `v1`

---

## 🔧 Build Instructions (Locally)

```bash
docker build -t tifarekaseke/job-finder-app:v1 .
docker push tifarekaseke/job-finder-app:v1
 Run Instructions
On Web01:

bash
Copy
Edit
docker run -d \
  --name job-app-web01 \
  -p 8080:8080 \
  tifarekaseke/job-finder-app:v1
On Web02:

bash
Copy
Edit
docker run -d \
  --name job-app-web02 \
  -p 8080:8080 \
  tifarekaseke/job-finder-app:v1
 Load Balancer Configuration (HAProxy on Lb01)
HAProxy Config (/usr/local/etc/haproxy/haproxy.cfg):

haproxy
Copy
Edit
global
    log stdout format raw local0
    daemon
    maxconn 256

defaults
    log     global
    mode    http
    option  httplog
    timeout connect 5000ms
    timeout client  50000ms
    timeout server  50000ms

frontend http-in
    bind *:80
    default_backend webapps

backend webapps
    balance roundrobin
    server web01 172.20.0.2:8080 check
    server web02 172.20.0.3:8080 check
Reload HAProxy Config:

bash
Copy
Edit
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /usr/local/etc/haproxy/haproxy.cfg'
✅ Testing Steps & Verification
Accessed the app using: curl http://localhost:8082

Monitored HAProxy logs to confirm alternating requests:

bash
Copy
Edit
docker logs -f lb-01
Example:

bash
Copy
Edit
http-in webapps/web01 ... "GET / HTTP/1.1"
http-in webapps/web02 ... "GET / HTTP/1.1"
✅ Confirmed load is alternating between containers

🔐 Hardening Tips
To avoid hardcoding secrets like API keys:

Use a .env file for local development

Reference environment variables in your code (e.g., process.env.API_KEY)

Exclude .env from Git by adding it to .gitignore

Example Docker run with env:

bash
Copy
Edit
docker run -d \
  -e API_KEY=your_real_api_key \
  -p 8080:8080 \
  tifarekaseke/job-finder-app:v1
