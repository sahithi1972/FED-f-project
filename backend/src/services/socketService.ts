import { Server, Socket } from 'socket.io';
import prisma from '../config/database';

export class SocketService {
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id);

      // Join user to their personal room for notifications
      socket.on('join-user', (userId: string) => {
        socket.join(`user-${userId}`);
      });

      // Join recipe room for real-time updates
      socket.on('join-recipe', (recipeId: string) => {
        socket.join(`recipe-${recipeId}`);
      });

      // Handle recipe likes
      socket.on('recipe-like', async (data: { recipeId: string, userId: string }) => {
        try {
          const recipe = await prisma.recipe.update({
            where: { id: data.recipeId },
            data: {
              likes: { increment: 1 }
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });

          // Notify all users in the recipe room
          this.io.to(`recipe-${data.recipeId}`).emit('recipe-updated', {
            type: 'like',
            recipeId: data.recipeId,
            likes: recipe.likes,
            userId: data.userId
          });

          // Notify recipe owner
          this.io.to(`user-${recipe.userId}`).emit('notification', {
            type: 'recipe_liked',
            recipeId: data.recipeId,
            recipeTitle: recipe.title,
            likedBy: data.userId
          });

        } catch (error) {
          socket.emit('error', { message: 'Failed to like recipe' });
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Method to emit events from other parts of the application
  public emitToUser(userId: string, event: string, data: any) {
    this.io.to(`user-${userId}`).emit(event, data);
  }

  public emitToRecipe(recipeId: string, event: string, data: any) {
    this.io.to(`recipe-${recipeId}`).emit(event, data);
  }

  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }
}

let socketService: SocketService;

export const initializeSocket = (server: any) => {
  socketService = new SocketService(server);
  return socketService;
};

export const getSocketService = () => {
  if (!socketService) {
    throw new Error('Socket service not initialized');
  }
  return socketService;
};
