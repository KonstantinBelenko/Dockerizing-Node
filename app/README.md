# Basic NodeJs server inside docker

This example should provide you with the next knowledge:
1. What is dockerfile
2. What is .dockerignore
3. The structure of Dockerfile
4. How to create a Dockerfile
5. How to run web applications inside docker

# What is Dockerfile
Essentially - Dockerfile is a simple text file that contains the build instructions to build the docker [image](https://docs.docker.com/engine/reference/commandline/images/).

The advantage of a Dockerfile is that it allows you to automatically build the latest version of your software, which is advantageous from a security perspective. This is because you can be confident that you are not installing any vulnerable software.

# What is .dockerignore
The .dockerignore file is alike to the [.gitignore](https://stackoverflow.com/questions/27850222/what-is-gitignore-exactly/27850270) file; both files allow you to select which files or directories to ignore. The .dockerignore file is particularly useful because it can help you reduce the size of the image and speed up the build process. It allows you to specify a list of files or directories that Docker is to ignore during the build process.

# Structure of dockerfile
Dockerfile is a script that containes a set of actions performed on a base image in order to create a new, modified image.

* Dockerfile Syntax <br> <br>
It consists of two kind of main line blocks: 
    1. comments 
        ```Dockerfile
        # Line block comment
        command argument argument ..
        ```
    2. commands + arguments
        ```Dockerfile
        # Print "Hello docker!"
        RUN echo "Hello docker!"
        ```

* Dockerfile start

    Each Dockerfile starts from the `FROM <Image name>` command.
    This command specifies the base image that other actions
    in the Dockerfile will be applied on.

    You can use nothing as the base image if you want to. It's done with the `scratch` keyword as in `FROM scratch`. It's used as the base for building other base images such as `debian` and `busybox`.

* Dockerfile - list of most usefull commands.
    
    [Full list of Dockerfile commands](https://docs.docker.com/engine/reference/builder/)

    1. [FROM](https://docs.docker.com/engine/reference/builder/#from) - Each Dockerfile starts with this commands
    2. [WORKDIR](https://docs.docker.com/engine/reference/builder/#workdir) - This command sets the base directory for any `RUN`, `CMD`, `ENTRYPOINT`, `COPY` and `ADD` that follow in the Dockerfile.
    3. [COPY](https://docs.docker.com/engine/reference/builder/#copy) - Copies files from \<src> starting in the same folder as the Dockerfile, to \<dest> inside the docker image
    4. [RUN](https://docs.docker.com/engine/reference/builder/#copy) - Executes specified command in a shell. Default shell is `/bin/sh -c` on Linux and `cmd /S /C` on Windows
    5. [EXPOSE](https://docs.docker.com/engine/reference/builder/#copy) - Instructs the docker container to listen on certain ports at runtime. Port type could be specified with \<port>/type as in `80/tcp` or `80/udp`
    6. [CMD](https://docs.docker.com/engine/reference/builder/#copy) - Provides defaults for app execution inside the container. There could be only one `CMD` command and it could have 3 forms.
        * `CMD ["executable", "param1", "param2"]` - Preffered form (exec)
        * `CMD ["param1", "param2"]` - Uses default shell specified by `ENTRYPOINT`
        * `CMD command param1 param2` - shell form <br>

* Dockerfile - Layers

    **Layer** - is a change on an image, or an intermediate image. Every command you specify (`FROM`, `RUN`, `COPY`, etc.) in your Dockerfile causes the previous image to change, creating a new layer.

    As an example - the Dockerfile inside this directory contains only 7 Layers, as commends does not count for individual layers.

# Creating Dockerfile
The procedure of creating a dockerfile is quite simple. Create a file and name it `Dockerfile` . Naming could be anything, but the default `Dockerfile` name does not require to be specified in the process of building it into an image.

After that - The base image should be specified with the `FROM ` command. In our example Dockerfile - it is `FROM node:16`. It tells the Docker engine to pull the image named `node` of version 16 from the Docker hub and use it as the base for all further operations.

At this point Dockerfile is ready for the build stage, but I will continue to describe our current Dockerfile inside this directory.

After creating the first layer of our Dockerfile with `FROM node:16` - we will specify the workdir of our app. Remember, all following commands after `WORKDIR` will assume the current directory to be specified one. If not changed of course.
```Dockerfile
WORKDIR /usr/src/app
```

Next thing we'll want to copy the list of dependencies and install them for our node app. For that we'll want to copy the package.json & package-lock.json files, and run npm install afterwards.
```Dockerfile
# We use package*.json because it allows us to copy both files simultaneously
COPY package*.json ./

# Install the dependencies afterwards
RUN npm install
```
After this we'll need to copy the source code of the app itself.
```Dockerfile
# This will copy everything that's not copied already.
COPY . .
```

Now all that's left is to expose application port and set the entry point when running this as a container.

We can expose application port with the `EXPOSE <port>` command. Just need to know the port number itself. In our example it is either the environment variable `PORT` or 3000. We will expose port 3000 by default.
```Dockerfile
EXPOSE 3000
```
For the entry point, we will use preferred format. Just need to specify the executable itself `node` and our source file.
```Dockerfile
CMD ["node", "index.js"]
```

That's all. Now your application is ready for the built stage.
# Running web applications in docker

First a vol, to run our application we'll need to [build](https://docs.docker.com/engine/reference/commandline/build/) the Dockerfile into an actual shareable image.

To build it, we use this cli command. 
```bash
$ docker build [options] path

# Use -t for tag, the name of the image
# And . for the path
#
# If the name of your file is not `Dockerfile`
# than specify it with -f <filename> and add .
# at the end of your command.

$ docker build -t web-app .
```

To check if your image has build successfully, enter
```bash
# For Linux
$ docker images | grep web-app

# For Windows
$ docker images | Select-String web-app
```
Command `docker images`  will bring up all images that are stored on your computer, we can pipe it to `grep web-app` to only get web-app.

This command will show us image name, image id, when it was created and the size.

Finally, to run our image we should go with the next command
```bash
$ docker run [options] <image name>

# Run in the attached, terminal mode.
# Use -p to map container ports to local machine ports
# -p <local port>:<container port>
$ docker run -it -p 8080:3000 web-app /bin/bash

# Run in the detached mode. (preffered)
$ docker run -d -p 8080:3000 web-app
```

After this you can check the list of running containers
```bash
# All containers
$ docker container ls


# Only web-app | Linux
$ docker container ls | grep web-app

# Only web-app | Windows
$ docker container ls | Select-String web-app
```

The container should be there and running. To actually see it work you should open your browser and go to http://localhost:8080

If you see text that looks something like this:
```
Hello! Session id: 924fa22769e443f8a429d7840c2344b0
```
Than you've succeeded! Congrats!

To stop that container - you should get the id of the running container and enter
```bash
# To stop container normally
$ docker stop <id>
# wait a little for it to stop
$ docker rm <id>

# To stop container immediately
$ docker rm <id> --force
```