import { connection, manager } from "../database/connection.ts";

interface Where {
  [key: string] : any
}

interface FindOptions {
  where?: Where,
  includes?: any,
  limit?: number,
  offset?: number
}

export abstract class AbstractRepository {
  /**
   * Getter for model object
   */
  abstract get model(): any;

  /**
   * Getting all resultset from a SELECT query here
   * adding the select options (where and pagination)
   * as parameter
   * 
   * @param options 
   * @returns 
   */
  async selectAll(options?: FindOptions) {
    const query = manager.query(this.model);

    if (options && options.where) {
      for (let key in options.where) {
        if (options.where.hasOwnProperty(key)) {
          query.where(key, options.where[key]);
        }
      }
    }

    if (options && options.limit) {
      query.limit(options.limit);
    }

    if (options && options.offset) {
      query.offset(options.offset);
    }

    if (options && options.includes) {
      if (options.includes.length > 0) {
        options.includes.forEach((include: any) => {
          query.include(include.toString());
        });
      }
    }

    return await query.all();
  }

  /**
   * Returns the count of the result set based from select options
   * 
   * @param options 
   * @returns 
   */
   async count(options?: FindOptions) {
    const query = manager.query(this.model);

    if (options && options.where) {
      for (let key in options.where) {
        if (options.where.hasOwnProperty(key)) {
          query.where(key, options.where[key]);
        }
      }
    }

    return await query.count();
  }

  /**
   * Similar to find() functions but we're only getting the
   * single object from the resultset with select options
   * (where) and include as tablename from other model
   * 
   * @param options 
   * @returns 
   */
  async selectOne(options?: FindOptions) {

    const query = manager.query(this.model);

    if (options && options.where) {
      for (let key in options.where) {
        if (options.where.hasOwnProperty(key)) {
          query.where(key, options.where[key]);
        }
      }
    }

    if (options && options.includes) {
      if (options.includes.length > 0) {
        options.includes.forEach((include: any) => {
          query.include(include.toString());
        });
      }
    }

    return await query.first();
  }

  /**
   * Return the resultset from select query and 
   * append as well the total count
   * 
   * @param options 
   * @returns 
   */
  async selectAndCount(options?: FindOptions): Promise<[any[], number]> {
    const result = await this.selectAll(options);
    const count = await this.count(options);

    return [result, count];
  }

  /**
   * Insert query in database
   * 
   * @param data 
   * @returns 
   */
  async insert(data: any) {
    return await manager.save(data);
  }

  /**
   * Update query in database
   * 
   * @param id 
   * @param data 
   */
  async update(id: any, data: any) {
    await manager.query(this.model).where('id', id).update(data);
  }

  /**
   * Delete query in database
   * 
   * @param where 
   */
  async delete(where: Where) {
    const query = manager.query(this.model);
    for (let key in where) {
      if (where.hasOwnProperty(key)) {
        query.where(key, where[key]);
      }
    }

    await query.delete();
  }

  /**
   * Running a custom query in the database
   * 
   * @param sql 
   * @returns 
   */
  async execute(sql: string) {
    return await connection.query(sql);
  }
}
