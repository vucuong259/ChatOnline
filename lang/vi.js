export const transValidation = {
    email_incorrect: 'Email phải có dạng example: vucuong259@gmail.com',
    gender_incorrect: 'Ủa, tại sao trường giới tính lại sai?',
    password_incorrect: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt',
    password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác',


};

export const transError = {
    account_in_use: 'Email này đã được sử dụng',
    account_removed: 'Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
    account_not_active: 'Email này đã được đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi',
    token_undefined: 'Token không tồn tại!',
    login_failed: 'Sai tài khoản hoặc mật khẩu!',
    server_error: 'Có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này. Xin cám ơn!',
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra lại email của bạn để active tài khoản trước khi đăng nhập. xin cảm ơn`
    },
    account_actived: 'Kích hoạt tài khoản thành công, bạn có thể đăng nhập vào ứng dụng',
    login_success: (username) => {
        return `Xin chào ${username}, chúc bạn một ngày tốt lành`;
    }
};

export const transMail = {
    subject: 'Chat Online: Xác nhận kích hoạt tài khoản.',
    template: (linkVerify) => {
        return `
        <h2>Bạn đã nhận được email này vì đã đăng ký tài khoản trên ứng dụng Chat Online.</h2>
        <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
        <h3><a href='${linkVerify}' target='blank'>${linkVerify}</a></h3>
        <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân Trọng!</h4>
        `;
    },
    send_failed: 'Có lỗi trong quá trình gửi email, vui lòng liên hệ lại với hỗ trợ của chúng tôi.'
}