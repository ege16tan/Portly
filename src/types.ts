export interface Container {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: string;
}

export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  password?: string;
}

export interface Credentials {
  username: string;
  password?: string;
}
