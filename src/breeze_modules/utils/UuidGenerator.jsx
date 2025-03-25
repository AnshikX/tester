import { v4 as id } from 'uuid';

const generate_uuid = () => {
  return id().replaceAll('-', '_');
};

export default generate_uuid;
