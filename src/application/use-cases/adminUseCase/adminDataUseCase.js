

class AdminDataUseCase {
    #adminDataRepository
    constructor(adminDataRepository) {
        this.#adminDataRepository = adminDataRepository
    }
    async updateProfile(data) {
        try {
            const adminId = data.orgData.adminId
            const { field, now } = data
            
            const newData = await this.#adminDataRepository.updateProfile(adminId, { [field]: now });

            const resData = {
                adminId: newData._id,
                email: newData.email,
                name: newData.name
            }
            
            return {
                status: 200,
                data: resData,
                message: "Profile updating successful."
            }

        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error Updating admin data.'
            };
        }
    }
    async updatePassword(data){
        try {

            const {adminId,currentPassword,newPassword}=data;

            return await this.#adminDataRepository.updatePassword(adminId,currentPassword,newPassword);
            
        } catch (error) {
            return {
                status: error.status || 500,
                message: error.message || 'Error Updating admin data.'
            };
        }
    }
    async takeTopData(){
        try {
            
            const data=await this.#adminDataRepository.takeTopData()
            // console.log(data);
            
            return{
                status:200,
                message:'take TopBar data successful.',
                data
            }

        } catch (error) {
             return {
                status: error.status || 500,
                message: error.message || 'Error take dashboard data.'
            };
        }
    }
}

export default AdminDataUseCase;