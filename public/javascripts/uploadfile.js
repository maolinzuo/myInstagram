// $(function(){
//   function readURL(input) {
//
//       if (input.files && input.files[0]) {
//           console.log(input.files);
//           var reader = new FileReader();
//
//           reader.onload = function (e) {
//               $('#blah').attr('src', e.target.result);
//           }
//
//           reader.readAsDataURL(input.files[0]);
//       }
//   };
//
//   $("#imgInp").change(function(){
//       readURL(this);
//       document.getElementById("blah").removeAttribute('hidden');
//
//   });
// })


  var resetPhoto = function(){
    document.getElementById("chooseFile").value = "";
    var label_img = document.getElementById("label_img");
    label_img.src="http://localhost:3000/images/upload.gif";
    document.getElementById("description").setAttribute('hidden', true);
    document.getElementById("reset_btn").setAttribute('hidden', true);
    document.getElementById("submit").setAttribute('hidden', true);
    document.getElementById('upload_text').removeAttribute('hidden');
    document.getElementById('chosenImage').remove();
  };

  $(function() {
     $("input:file").change(function (event){
       var fileName = $(this).val();
       //$(".filename").html(fileName);
       var extension = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();
       if(extension !== "jpg" && extension !== "jpeg" && extension !== "png" && extension !== "gif"){
         alert("Supported file extensions are .jpg, .jpeg, .png and .gif");
         document.getElementById("chooseFile").value = "";
       }else{
         var files = this.files;
         var reader = new FileReader();
         reader.onload= function(e){
           var img = document.createElement('img');
           img.id = "chosenImage"
           img.src= e.target.result;
           document.getElementById('highest_div').append(img);
           document.getElementsByClassName('box__input')[0].setAttribute('hidden',true);
           document.getElementById('upload_text').setAttribute('hidden',true);
           document.getElementById('description').removeAttribute('hidden');
           document.getElementById('submit').removeAttribute('hidden');
           document.getElementById('reset_btn').removeAttribute('hidden');
         };
         reader.readAsDataURL(files[0]);

       }
     });
  });
