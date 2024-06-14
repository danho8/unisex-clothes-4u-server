import { connectionSource } from './../../configs/connection';
import { AdminEntity } from './../../entities/admin.entities';

const importAdminUser = async (): Promise<void> => {
  try {
    await connectionSource
      .initialize()
      .then(async () => {
        const adminRepository = connectionSource.getRepository(AdminEntity);
        const user = adminRepository.create({
          email: 'admin@master.com',
          password:
            '$2a$10$HcLtanMUlywkv8bQLVUGC.Ss5bmmnEGlWzSMXXOT83Ft4Y1SR5SVa', // admin@4UT
          firstName: 'Admin',
          lastName: 'Master',
          isActive: true,
        });

        await adminRepository.save(user);

        console.log('User has been inserted successfully.');
      })
      .catch((error) =>
        console.log('Error during Data Source initialization:', error),
      )
      .finally(() => connectionSource.destroy()); // Đóng kết nối khi hoàn tất
  } catch (error) {
    console.log('Create Seed Admin User Fail!!!');
    console.log(error);
  }
};

importAdminUser();
