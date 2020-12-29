import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
  ) {
    super(Product, dataSource);
  }

  definePersistedModel(
    entityClass: typeof Product,
  ): typeof juggler.PersistedModel {
    const modelClass = super.definePersistedModel(entityClass);
    const cb = async () => {
      try {
        const httpCtx = await this.getHttpContext();
        console.log(`httpCtx.request.method=${httpCtx.request?.method}`);
      } catch (ex) {
        console.log(`httpCtx=undefined`);
      }
    };
    modelClass.observe('before save', cb);
    modelClass.observe('access', cb);
    return modelClass;
  }
}
