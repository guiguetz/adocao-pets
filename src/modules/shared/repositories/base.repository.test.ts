import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseRepository } from './base.repository';

// Create a concrete implementation for testing
interface TestEntity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

class TestRepository extends BaseRepository<TestEntity> {
  constructor() {
    super('testModel');
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;

  beforeEach(() => {
    repository = new TestRepository();
  });

  describe('constructor', () => {
    it('should create an instance with model name', () => {
      expect(repository).toBeDefined();
      // Access through any to test protected property
      expect((repository as any).modelName).toBe('testModel');
    });
  });

  describe('abstract methods', () => {
    it('should have findById method', () => {
      expect(typeof repository.findById).toBe('function');
    });

    it('should have findAll method', () => {
      expect(typeof repository.findAll).toBe('function');
    });

    it('should have create method', () => {
      expect(typeof repository.create).toBe('function');
    });

    it('should have update method', () => {
      expect(typeof repository.update).toBe('function');
    });

    it('should have delete method', () => {
      expect(typeof repository.delete).toBe('function');
    });
  });
});
