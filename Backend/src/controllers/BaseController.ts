import { Request, Response, NextFunction } from 'express';

/**
 * BaseController provides standard abstract boilerplate functionality 
 * for handling HTTP requests and standardized responses across the application.
 */
export abstract class BaseController {
  
  /**
   * Helper method to send a standardized success response.
   */
  protected sendSuccess(res: Response, data: any, statusCode: number = 200, count?: number): void {
    const payload: any = { success: true, data };
    if (count !== undefined) {
      payload.count = count;
    }
    res.status(statusCode).json(payload);
  }

  /**
   * Helper method to send a standardized error response natively.
   */
  protected sendError(res: Response, message: string, statusCode: number = 400): void {
    res.status(statusCode).json({ success: false, message });
  }

  /**
   * Async error handler wrapper to minimize try/catch boilerplate explicitly in sub-controllers.
   * Conceptually similar to express-async-handler but bound structurally to the controller.
   */
  protected asyncWrapper(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }
}
