import { AbstractRepository } from "../repositories/abstract.repository.ts";

export abstract class AbstractService {
  protected constructor(
    protected readonly repository: AbstractRepository) {
  }

  /**
   * Fetch all records
   * 
   * @param include 
   * @returns 
   */
  async all(includes: string[] = []) {
    return await this.repository.selectAll({
      includes
    });
  }

  /**
   * Adding pagination when fetching all the records
   * 
   * @param page 
   * @param include 
   * @returns 
   */
  async paginate(page: number = 1, includes:string[] = []) {
    const limit = 15;

    const [data, total] = await this.repository.selectAndCount({
      limit,
      offset: (page - 1) * limit,
      includes
    });

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    }
  }

  /**
   * Fetch one record
   * 
   * @param condition 
   * @param include 
   * @returns 
   */
  async findOne(condition: any, includes: string[] = []) {
    return await this.repository.selectOne({
      where: condition,
      includes
    });
  }

  /**
   * Fetch all records base on condition
   * 
   * @param condition 
   * @param include 
   * @returns 
   */
   async findAll(condition: any, includes: string[] = []) {
    return await this.repository.selectAll({
      where: condition,
      includes
    });
  }

  /**
   * Create data in the database
   * 
   * @param data 
   * @returns 
   */
  async create(data: any) {
    return await this.repository.insert(data);
  }


  /**
   * Update a record in the database
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  async update(id: any, data: any) {
    await this.repository.update(id, data);

    return await this.repository.selectOne({
      where: {id}
    });
  }

  /**
   * Delete record in the database
   * 
   * @param condition 
   */
  async delete(condition: any) {
    await this.repository.delete(condition);
  }
}
