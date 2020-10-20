export const transValidation = {
    email_incorrect: 'Email phải có dạng example: vucuong259@gmail.com',
    gender_incorrect: 'Ủa, tại sao trường giới tính lại sai?',
    password_incorrect: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt',
    password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác',


};

export const transError = {
    account_in_use: 'Email này đã được sử dụng',
    account_removed: 'Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
    account_not_active: 'Email này đã được đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi'
}

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra lại email của bạn để active tài khoản trước khi đăng nhập. xin cảm ơn`
    }
}