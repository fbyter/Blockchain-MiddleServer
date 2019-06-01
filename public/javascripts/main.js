const url = 'http://222.20.105.151:4396';
const name = document.getElementById('name').innerHTML;
let blocks = null;
//const layui = {layer:''}; //只是为了调试写代码方便

layui.use(['layer','form'], function () {
  const layer = layui.layer;
  const form = layui.form;

  /* transfer 表单提交绑定 */
  form.on('submit(formTransfer)', function(data){
    //console.log(data.field);
    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('post', url+'/pay');
    ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        //console.log(ajaxObj.responseText);
        let response = JSON.parse(ajaxObj.responseText); //string to json
        if(response.status === 'success') {
          document.getElementById('button_refresh_balance').click();
          alert(response.msg)
          //window.open(url+'/signin');
        } else {
          alert(response.msg)
        }
        //document.querySelector('h1').innerHTML = ajaxObj.responseText;
      }
    };

    //发送请求
    const args = data.field;
    if(isNaN(parseFloat(args.amount))) {
      alert('illegal amount!');
      return false
    }
    //args.amount = parseFloat(args.amount);
    args.flag = 1;
    args.payer = name; //document.get
    console.log(args);
    ajaxObj.send(JSON.stringify(args)); //json to string
    return false;
  });

  /* transfer表单渲染 */
  const html = document.getElementById('form_transfer');
  //console.log(html);
  document.getElementById('button_transfer').addEventListener('click', function () {
    layer.open({
      type: 1,
      title: 'transfer',
      content: html.outerHTML,
      //content: html
      //btn: ['确定', '取消'],
      success: function(layero, index){
        // 加载title数据
        form.render();
      },
    });
  },true);


  /* coin 表单提交绑定 */
  form.on('submit(formCoin)', function(data){
    //console.log(data.field);
    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('post', url+'/pay');
    ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        //console.log(ajaxObj.responseText);
        let response = JSON.parse(ajaxObj.responseText); //string to json
        if(response.status === 'success') {
          document.getElementById('button_refresh_balance').click();
          alert(response.msg);
          //window.open(url+'/signin');
        } else {
          alert(response.msg)
        }
      }
    };

    //发送请求
    const args = data.field;
    if(isNaN(parseFloat(args.amount))) {
      alert('illegal amount!');
      return false
    }
    args.flag = 0;
    args.payer = 'admin';
    args.owner = name;
    console.log(args);
    ajaxObj.send(JSON.stringify(args)); //json to string
    return false;
  });

  /* coin表单渲染 */
  const html2 = document.getElementById('form_coin');
  document.getElementById('button_coin').addEventListener('click', function () {
    layer.open({
      type: 1,
      title: 'coin',
      content: html2.outerHTML,
      success: function(layero, index){
        form.render();
      },
    });
  },true);

  /* withdraw 表单提交绑定 */
  form.on('submit(formWithdraw)', function(data){
    //console.log(data.field);
    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('post', url+'/pay');
    ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {
        let response = JSON.parse(ajaxObj.responseText); //string to json
        if(response.status === 'success') {
          alert(response.msg);
          document.getElementById('button_refresh_balance').click();
          //window.open(url+'/signin');
        } else {
          alert(response.msg)
        }
      }
    };

    //发送请求
    const args = data.field;
    if(isNaN(parseFloat(args.amount))) {
      alert('illegal amount!');
      return false
    }
    //args.amount = parseFloat(args.amount);
    args.flag = 1;
    args.payer = name;
    args.owner = 'admin';
    console.log(args);
    ajaxObj.send(JSON.stringify(args)); //json to string
    return false;
  });

  /* withdraw表单渲染 */
  document.getElementById('button_withdraw').addEventListener('click', function () {
    layer.open({
      type: 1,
      title: 'withdraw',
      content: document.getElementById('form_withdraw').outerHTML,
      success: function(layero, index){
        form.render();
      },
    });
  },true);

  /* refresh balance */
  document.getElementById('button_refresh_balance').addEventListener('click', function () {

    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', url+`/test?api=3&name=${name}`);
    //ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        let response = JSON.parse(ajaxObj.responseText); //string to json
        document.getElementById('balance').innerHTML = 'Num: '+response.balance;

        //document.querySelector('h1').innerHTML = ajaxObj.responseText;
      }
    };

    //发送请求
    ajaxObj.send(); //json to string
  },true);

  /* refresh blocks */
  document.getElementById('button_refresh_blocks').addEventListener('click', function () {

    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', url+`/test?api=4&name=${name}`);

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        let response = JSON.parse(ajaxObj.responseText); //string to json
        blocks = response.rows;
        document.getElementById('blockNum').innerHTML = blocks.length.toString();
        document.getElementById('input_choose').placeholder = '0-'+(blocks.length-1).toString();

        //启用按钮
        document.getElementById('button_display_block').disabled = false;
      }
    };
    //发送请求
    ajaxObj.send(); //json to string
  },true);

  /* show one block */
  document.getElementById('button_display_block').addEventListener('click', function () {

    let inputx = document.getElementById('input_choose');
    //console.log(inputx.value);
    let block = blocks[blocks.length - parseInt(inputx.value)];
    document.getElementById('channelName').innerHTML = block.channelname;
    document.getElementById('dataHash').innerHTML = block.datahash;
    document.getElementById('blockHash').innerHTML = block.blockhash;
    document.getElementById('preHash').innerHTML = block.prehash;
    document.getElementById('createDt').innerHTML = block.createdt;
    document.getElementById('txCount').innerHTML = block.txcount;

    let slt = document.getElementById('txHash_select');
    while(slt.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
      slt.removeChild(slt.firstChild);
    }

    for(let tx of block.txhash) {
      let opt = document.createElement('option');
      //opt.setAttribute("id", "newDiv");
      opt.setAttribute('value', tx);
      opt.innerHTML = tx;
      slt.appendChild(opt);
    }
    //document.getElementById('txHash_option').add = block.blocknum;

    //启用按钮
    document.getElementById('button_display_txHash').disabled = false;
  },true);


  /* txHash表单渲染 */
  document.getElementById('button_display_txHash').addEventListener('click', function () {

    let ajaxObj = new XMLHttpRequest();
    let transaction = document.getElementById('txHash_select').value;
    ajaxObj.open('get', url + `/test?api=5&name=${transaction}`);

    ajaxObj.onreadystatechange = function () {
      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {
        //let response = JSON.parse(ajaxObj.responseText); //string to json
        let response = JSON.parse(ajaxObj.responseText).row;

        document.getElementById('songResJson').innerHTML = JSON.stringify(response, null, 2);
        layer.open({
          type: 1,
          title: 'transaction',
          content: document.getElementById('form_txHash').outerHTML,
          success: function (layero, index) {
            form.render();
          },
        });

      }
    };
    //发送请求
    ajaxObj.send(); //json to string
  },true)

});
