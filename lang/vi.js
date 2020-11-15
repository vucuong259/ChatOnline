export const transValidation = {
    email_incorrect: 'Email phải có dạng example: vucuong259@gmail.com',
    gender_incorrect: 'Ủa, tại sao trường giới tính lại sai?',
    password_incorrect: 'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt',
    password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác',
    update_username: 'Username giới hạn trong 5 - 17 ký tự và không được phép chứa ký tự đặc biệt.',
    update_gender: 'Oops! Dữ liệu giới tính có vấn đề, bạn là hacker chăng?',
    update_address: 'Địa chỉ giới hạn khoảng 3 - 100 ký tự',
    update_phone: 'Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10 - 11 ký tự',
    keyword_find_user: 'Lỗi từ khóa tìm kiếm, chỉ cho phép ký tự chữ cái và số, cho phép khoảng trống.',
    message_text_emoji_incorrect: 'Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 ký tự, tối đa 400 ký tự'

};

export const transError = {
    account_in_use: 'Email này đã được sử dụng',
    account_removed: 'Tài khoản này đã bị gỡ khỏi hệ thống, nếu tin rằng điều này là hiểu nhầm, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi',
    account_not_active: 'Email này đã được đăng ký nhưng chưa active tài khoản, vui lòng kiểm tra email của bạn hoặc liên hệ với bộ phận hỗ trợ của chúng tôi',
    account_undefined: 'Tài khoản này không tồn tại',
    token_undefined: 'Token không tồn tại!',
    login_failed: 'Sai tài khoản hoặc mật khẩu!',
    server_error: 'Có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này. Xin cám ơn!',
    avatar_type: 'Kiểu file không hợp lệ, chỉ chấp nhận jpg & png.',
    avatar_size: 'Ảnh upload tối đa cho phép là 1M',
    user_current_password_failed: 'Mật khẩu hiện tại không chính xác.',
    converstation_not_found: 'Cuộc trò chuyện không tồn tại'
};

export const transSuccess = {
    userCreated: (userEmail) => {
        return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra lại email của bạn để active tài khoản trước khi đăng nhập. xin cảm ơn`
    },
    account_actived: 'Kích hoạt tài khoản thành công, bạn có thể đăng nhập vào ứng dụng',
    login_success: (username) => {
        return `Xin chào ${username}, chúc bạn một ngày tốt lành`;
    },
    logout_success: 'Đăng xuất tài khoản thành công, hẹn gặp lại bạn',
    avatar_updated: 'Cập nhật lại dữ liệu thành công',
    user_info_updated: 'Cập thật thông người dùng thành công',
    user_password_updated: 'Cập nhật mật khẩu thành công',

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