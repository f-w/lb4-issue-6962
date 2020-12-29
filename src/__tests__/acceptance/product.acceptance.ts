import {Client} from '@loopback/testlab';
import {Lb4Issue6962Application} from '../..';
import {ProductRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('Product', () => {
  let app: Lb4Issue6962Application;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  beforeEach(async function () {
    const productRepository: ProductRepository = await app.get(
      'repositories.ProductRepository',
    );
    await productRepository.create({
      name: 'foo',
    });
  });

  it('should get product', async () => {
    await client.get('/products').expect(200);
  });
});
