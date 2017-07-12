var user_email = [];

$(function() {
   $("#create_new_chat").click(function (event){
     $.ajax({
       type:"GET",
       url:"/getallusers",
       data: {},
       success: function(data){
         data.forEach(function(user){
           create_user_in_modal(user.email);
         });
       },
       error: function(error){
         console.log("error");
       }
     });
   });
});


var create_user_in_modal = function(username){
  if(user_email.indexOf(username) < 0){
  var user_name_container = document.createElement('div');
  user_name_container.addEventListener('click',function(){
      create_talk_to(username);
  });
  user_name_container.innerHTML =   `<div class="newChat-user-meta">
      <img class="img-circle" src="http://localhost:3000/images/user.png">
      <span class="userlist-userName">${username}</span>
    </div>`;
  $('.userlist-user-meta').append(user_name_container);
  user_email.push(username);
}
};
    //  var fileName = $(this).val();
    //  //$(".filename").html(fileName);
    //  var extension = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
    //  if(extension !== "jpg" && extension !== "jpeg" && extension !== "png" && extension !== "gif"){
    //    alert("Supported file extensions are .jpg, .jpeg, .png and .gif");
    //    document.getElementById("chooseFile").value = "";
    //  }else{
    //    var files = this.files;
    //    var reader = new FileReader();
    //    reader.onload= function(e){
    //      var img = document.getElementById('label_img');
    //      img.src= e.target.result;
    //      img.style.width='400px';
    //      document.getElementById('upload_text').setAttribute('hidden',true);
    //      document.getElementById('description').removeAttribute('hidden');
    //      document.getElementById('submit').removeAttribute('hidden');
    //      document.getElementById('reset_btn').removeAttribute('hidden');
    //    };
    //    reader.readAsDataURL(files[0]);
     //
    //  }
