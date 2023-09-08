import path from "path";
import Docker from "dockerode";
import DockerodeCompose from "dockerode-compose";

const docker = new Docker();
const compose = new DockerodeCompose(
  docker,
  path.resolve(__dirname, "../resources/hoppingmode-web.docker-compose.yml"),
  "hoppingmode-web"
);

export function pullImage(image: string) {
  return new Promise((resolve, reject) => {
    docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
      if (err) {
        reject(err);
      }

      docker.modem.followProgress(stream, (err, output) => {
        if (err) {
          reject(err);
        }

        resolve(output);
      });
    });
  });
}

export function startContainer(name: string, image: string, hostPort: number) {
  return new Promise((resolve, reject) => {
    docker.createContainer(
      {
        Image: image,
        ExposedPorts: {
          [hostPort]: {}
        },
        HostConfig: {
          PortBindings: {
            [hostPort]: [
              {
                HostPort: hostPort
              }
            ]
          }
        },
        name
      },
      (err, container) => {
        if (err) {
          reject(err);
        }

        container.attach({ stream: true, stdout: true, stderr: true }, function (err, stream) {
          stream.pipe(process.stdout);
        });

        container.start((err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data);
        });
      }
    );
  });
}

export function composeUp() {
  return new Promise((resolve, reject) => {
    compose.up((err, output) => {
      if (err) {
        reject(err);
      }

      resolve(output);
    });
  });
}

export function composeDown() {
  return new Promise((resolve, reject) => {
    compose.down((err, output) => {
      if (err) {
        reject(err);
      }

      resolve(output);
    });
  });
}
