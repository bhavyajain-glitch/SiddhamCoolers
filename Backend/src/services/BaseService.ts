import { Model, Document } from 'mongoose';

/**
 * BaseService defines the standard polymorphic structure for any model-interacting service.
 * Heavily utilizes Generics <T> so specific services seamlessly inherit typed behavior.
 */
export abstract class BaseService<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  public async findAll(filters: any = {}): Promise<T[]> {
    return this.model.find(filters);
  }

  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  public async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  public async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  public async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }
}
