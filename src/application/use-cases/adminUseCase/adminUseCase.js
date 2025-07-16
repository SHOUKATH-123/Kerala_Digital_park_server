


class AdminUseCase {
  #adminRepository
  constructor(adminRepository) {
    this.#adminRepository = adminRepository
  }
  async login(LoginData) {
    try {
      const { email, password } = LoginData;
      
      const AdminData = await this.#adminRepository.login(email, password);

      return {
        status: 200,
        message:'Login successful. Welcome, Admin!.',
        data: {
          adminId: AdminData._id,
          email: AdminData.email
        }
      }

    } catch (error) {
      return {
        status: error.status || 500,
        message: error.message || 'An error occurred during login'
      };
    }
  }

}

export default AdminUseCase;