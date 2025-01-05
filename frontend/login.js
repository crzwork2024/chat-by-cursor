document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 防止表单默认提交

    const name = document.getElementById('name').value;
    const employeeId = document.getElementById('employeeId').value;
    const department = document.getElementById('department').value;

    // 这里可以添加 AJAX 请求将数据发送到后端进行处理
    console.log('姓名:', name);
    console.log('工号:', employeeId);
    console.log('科室:', department);

    // 示例：假设登录成功，返回到之前的页面
    alert('登录成功！');
    window.history.back(); // 返回到之前的页面
}); 