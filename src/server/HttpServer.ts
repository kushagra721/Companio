import express, { Express, Request, Response } from "express";
import http from "http";
import cors from 'cors';
import connectToDatabase from "../config/db";
import { ExternalController } from "../controllers/ExternalController";
import { categoryRoutes } from "../routes/categoryRoutes";
export class HttpServer {
  private app: Express;
  private port: number;
  private server: http.Server;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.connectToDatabase();
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await connectToDatabase();
      console.log("Database connected successfully.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  }

  // Middleware configuration
  private configureMiddleware(): void {
    this.app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "*"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files from a public directory
   // this.app.use(express.static(path.join(__dirname, "../public")));
  }

  // Route configuration
  private configureRoutes(): void {
    const externalController = new ExternalController();
    this.app.use("/companio/external", externalController.router);
    this.app.use("/api/categories", categoryRoutes);
    this.app.get("/cms/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
        port: this.port,
      });
    });
  }

  // Start the HTTP server
  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}
