---
id: backend-setup
title: Setup New Django Backend
sidebar_position: 2
---

Before Start Make Sure create a staging branch and add into requirements.txt :
    ```python
    mysqlclient==2.1.1
    gunicorn==20.1.0
    gevent==22.10.2
    ```

### Generate SSH Key

Open your terminal and run the following command to generate a new SSH key:

```sh
$ ssh-keygen -t rsa
```

### Enter the file path to save the key

```sh
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa): /home/ubuntu/key/<repo_name>
```

### Set the passphrase (leave empty for no passphrase)

```sh
Enter passphrase (empty for no passphrase): <enter>
Enter same passphrase again: <enter>
```

By leaving the passphrase fields empty, you are opting not to set a password for the SSH key.

### **Step 1**

1. Need to locate your **codetinker-staging-01.pem** using cmd
2. Then $chmod 400 **codetinker-staging-01.pem**
3. Then connect it by $ssh -i codetinker-staging-01.pem ubuntu@XXXXXXX (get from sw)

### **Step 2**

1. Locate the folder
2. $ cd project
3. $ ls (check what project you have)
4. Create folder
   - $ mkdir `project-name`
   - Create media and static file into it ($ mkdir `media`, $mkdir `static`)
   - For backend we just git pull will do ($ git clone --branch staging git@`project-back`:codetinker-dev/`project-back`.git)
   - For front create folder ( $mkdir `project-front`)

### **Step 3**

1. Setup your env file, add field that u needed
2. Most import field to change

   ```python
   ALLOWED_HOSTS=127.0.0.1,localhost, DOMAIN (GET FROM FOX)
   DATABASE_URL= GET FROM FOX
   MEDIA_RELATIVE_PATH=media
   STATIC_RELATIVE_PATH=static
   ```

3. go to your back end and follow these steps

   ```sh
   $ cd project
   $ cd project-name
   $ cd project-back
   $ pyevn local 3.9.9
   $ python -m venv venv
   $ source venv/bin/activate
   $ pip install -r requirements.txt
   $ python manage.py showmigrations
   $ python manage.py collectstatic
   ```

   after you showmigrations and no error can proceed to $ cd python manage.py migrate

4. Check which port is available
   `YOUR_PORT` eg: 9600 , 9711 and so on

   ```sh
   $ ps aux | grep :YOUR_PORT
   ```

   after run, if u saw one row/line means is availabe, if u see around 3-4 lines means the
   port is alredy in used.

5. Create the run.sh and stop.sh file

- `YOUR_PORT` is the port u gonna use, `REPO` eg as :loyalty_reward, digitalmarketplace

  ```sh
  $ vi stop.sh
  ```

  It will help u open file, then press I to Edit, Then add

  ```sh
  #!/usr/bin/env bash
  ps aux | grep 127.0.0.1:YOUR_PORT
  ```

  Save it, press esc, tpy :wq! , press enter

  ```sh
  $ vi run.sh
  ```

  After created add, then press I to Edit, Then add

  ```sh
  #!/usr/bin/env bash
  gunicorn --timeout 600 --workers 3 -k gevent -b 127.0.0.1:YOUR_PORT REPO.wsgi:application 2>&1 >/dev/null &
  ```

  Save it, press esc, tpy :wq! , press enter

6. Once Everything is good, we can proceed to setup nginx file

### **Step 4**
1. create nginx file

    ```sh
    $ sudo ln -s /etc/nginx/sites-available/project-name /etc/nginx/sites-enabled/
    ```

2. The locate the file file and cd it
    ```sh
    $ cd /etc
    $ cd /nginx/sites-enabled
    $ sudo vi project-name
    ```

    And then copy and replace the `project-name`

    ```sh 
        server {
        listen 443 ssl;
        ssl_certificate /etc/letsencrypt/live/goecom.my-0001/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/goecom.my-0001/privkey.pem;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        server_name project-name.goecom.my;
        # access_log off;
        error_page 404 /;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        client_max_body_size 5M;
        location / {
            alias /home/ubuntu/project/project-name/project-front/dist/;
        }
        location /static/ {
            alias /home/ubuntu/project/project-name/static/;
        }
        location /media/ {
            alias /home/ubuntu/project/project-name/media/;
        }
        location /v1/ {
            proxy_pass http://127.0.0.1:YOUR_PORT/v1/;
            proxy_set_header X-Forwarded-Host $server_name;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            add_header P3P 'CP="ALL DSP COR PSAa PSDa OUR NOR ONL UNI COM NAV"';
        }
        location /graphql {
            proxy_pass http://127.0.0.1:YOUR_PORT/graphql;
            proxy_set_header X-Forwarded-Host $server_name;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            add_header P3P 'CP="ALL DSP COR PSAa PSDa OUR NOR ONL UNI COM NAV"';
        }
        location /admin/ {
            proxy_pass http://127.0.0.1:YOUR_PORT/admin/;
            proxy_set_header X-Forwarded-Host $server_name;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            add_header P3P 'CP="ALL DSP COR PSAa PSDa OUR NOR ONL UNI COM NAV"';
        }
    }
    ```

    Then Save and Exit.

3. Last Step

    ```sh
    $ sudo nginx -t
    ```

    Test the connection first, if return conf:sucess means okay.
    Then can restart: 

    ```sh
    $ sudo service nginx restart
    ```