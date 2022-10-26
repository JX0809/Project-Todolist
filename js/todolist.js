$(function () {
    // 存储的数据格式：var todolist = [{ title : ‘xxx’, done: false}]

    // 1. 按下回车键 把表单里的文字数据存储到本地存储
    // 按下回车：键盘事件对象keycode
    load(); //打开或刷新页面自动渲染加载
    $(".task").on("keydown", function (event) {
        // 判断是否按下回车键
        if (event.keyCode === 13) {
            if ($(this).val() === "") {
                alert("请输入内容");
            } else {
                // 先读取数组原来的数据。 声明一个数组, 把本地数据赋值给数组
                var local = getData(); // getData 已经转成了对象格式
                // console.log(local);
                // 把local数组进行更新，把最新的数据（用户在表单输入的内容)追加给local数组  然后把更新的数组重新存储到本地
                local.push({ title: $(this).val(), done: false })
                saveData(local); // 实参
                load();
                $(this).val("");
            }
        }
    })

    // 3. todolist 删除操作
    $("ol, ul").on("click", "a", function () {
        // 先获取本地存储数据
        var data = getData();
        // console.log(data);
        // 删除对应的数据
        var index = $(this).attr("id") //获取自定义属性
        data.splice(index, 1);
        // 保存给本地存储
        saveData(data);
        // 重新渲染列表
        load();
    })

    // 4.正在进行和已完成选项操作
    $("ol, ul").on("click", "input", function () {
        // alert('11')
        // 先获取本地存储数据
        var data = getData();
        // console.log(data);
        // 修改对应的数据
        var index = $(this).siblings("a").attr("id"); //获取兄弟元素 a的自定义属性
        // console.log(index);
        data[index].done = $(this).prop("checked");  // done 默认false。 复选框默认没勾上。 当勾上， done == true
        // 保存给本地存储
        saveData(data);
        // 重新渲染列表
        load();
    })

    // 获取本地存储的数据 localStorage.getItem(key, value)
    function getData() {
        var data = localStorage.getItem("todolist"); // input 数据
        if (data !== null) {
            // 本地存储的数据是符串形式的。 我们需要把他转换成对象格式赋值给数组
            return JSON.parse(data);
        } else {
            return [];
        }
    };

    // 把数组存储给本地储存 saveData（）
    function saveData(data) {  // data 是形参
        localStorage.setItem("todolist", JSON.stringify(data))  // local 是局部变量。 把saveData 在 local 函数里调用一次
    }

    // 2. 本地储存数据渲染加载
    function load() {
        // 先读取本地数据
        var data = getData();
        // 遍历元素前先清空ol里的内容
        // $("ol").empty();
        // $("ul").empty();
        $("ol, ul").empty();
        // 统计正在进行个数和已经完成个数
        var todoCount = 0;
        var doneCount = 0
        // 遍历数据:1. $.each()方法可用于遍历任何对象。主要用于数据处理，比如数组，对象
        $.each(data, function (i, ele) {
            if (ele.done == true) {
                $("ul").prepend("<li> <input type='checkbox' checked = 'checked'> <p>" + ele.title + "</p> <a href='javascript:;' id = " + i + ">删除</a></li>") // a id 自定义索引号
                doneCount++;
            } else {
                $("ol").prepend("<li> <input type='checkbox'> <p>" + ele.title + "</p> <a href='javascript:;' id = " + i + ">删除</a></li>") // a id 自定义索引号
                todoCount++
            };
        })
        $(".todocount").text(todoCount);
        $(".donecount").text(doneCount);
    }


    // 修改事项里的文字内容
    $('ol').on("dblclick", "p", function () {
        var str;
        str = $(this).html();
        // 创建添加元素语法: element.prepend(''<li></li>'');
        $(this).prepend("<input type = 'text'>");
        var input = $(this).children("input");
        input.val(str);

        $("input").on("blur", function () {
            $(this).parent("p").html(this.val);
        })
    })
})