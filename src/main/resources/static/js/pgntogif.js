
let dir_link = './images/';
let image_link = '';
let images =[];
let gif_src;
let gif_id;

const label_name = [ //skin과 기물 라벨명
    'board',
    'white pawn',
    'white night',
    'white bishop',
    'white rook',
    'white queen',
    'white king',
    'black pawn',
    'black night',
    'black bishop',
    'black rook',
    'black queen',
    'black king',
]
let pgndata = '';
let black_bottom_opt = 0;

 window.onload = function() {
        // localStorage에서 선택된 값 가져오기, skin 셋 정의
        const selectedValue = localStorage.getItem('skin_data');
        if (selectedValue) {
            // 콤보박스 요소 가져오기
            const selectElement = document.getElementById('skinselect');
            // 콤보박스 값 설정
            selectElement.value = selectedValue;
            image_link = selectedValue; //몇 번째 스킨인지 지정
        }

        addImage(".png");
   }


 function addImage(imagetype)
 {
    //스킨 데이터를 화면에 보여주기 위해 추가
    images = [];
    for (let i = 0; i <= 12; i++) {
        //skin, piece 경로 붙이기
        images.push(dir_link + image_link + "/" + i.toString().padStart(2, '0') + imagetype);
    }

     const gallery = document.getElementById('image_gallery');
     idx = 0;
        // 이미지 배열을 순회하여 갤러리에 추가
        images.forEach(src => {
            // div.col 생성
            const colDiv = document.createElement('div');
            colDiv.className = 'col-md-4';
            // input 태그 생성
            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.id = label_name[idx] + " upload"; //파일 입력 받는 컨텐츠 추가
            inputElement.accept = "image/*";
            inputElement.style = "display: none;";


            //img 태그 생성
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.className = 'img-fluid mini';
            imgElement.alt = src;
            imgElement.id = label_name[idx];

            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = label_name[idx];
            // colDiv에 img 태그 추가
            colDiv.appendChild(imgElement);
            colDiv.appendChild(inputElement);
            colDiv.appendChild(labelDiv);
            // gallery 요소에 colDiv 추가
            gallery.appendChild(colDiv);
            prepareUpload(idx);
            idx = idx + 1;
        });
 }

 function prepareUpload(idx) //커스텀 이미지로 변경 시, 화면 구성을 위해 이미지 경로 업데이트
 {
     const imgElement = document.getElementById(label_name[idx]);
     const inputElement = document.getElementById(label_name[idx] + " upload");
     imgElement.addEventListener('click',uploading(label_name[idx] + " upload"));
     inputElement.addEventListener('change',update_img(idx, label_name[idx]));
 }

 function uploading(upload_id) //커스텀 이미지 변경을 위한 이벤트 구성
 {
    return function(event){
      const fileInput = document.getElementById(upload_id);
      fileInput.click();
      };
 }

   function getDropdownValue()
   { //서비스가 제공하는 보드 업데이트
     const selectedValue = document.getElementById('skinselect').value;
     if (selectedValue) {
         // 콤보박스 요소 가져오기
         image_link = selectedValue;
         for (let i = 0; i < 1; i++) {
             images[i] = dir_link + image_link + "/" + i.toString().padStart(2, '0') + ".png";
             document.getElementById(label_name[i]).src = images[i];
             document.getElementById(label_name[i]).alt = images[i];
         }
     }
  }

  function update_img(idx,img_id)
  {
    //커스텀 스킨을 유저로 부터 받아와서 서버에 저장
     return function(event){
         const file = event.target.files[0];

          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  const form_data = new FormData();
                  form_data.append('file',file);

                  fetch('/api/upload', {
                      method: 'POST',
                      body: form_data
                  }).then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                      //console.log(data.output_dir); // 서버의 응답을 처리합니다
                      download_dir = data.download_dir;
                      images[idx] = download_dir;
                      const img = document.getElementById(img_id);
                      img.src = e.target.result;
                    })
                    .catch(error =>console.error('Error:', error));

              };
              reader.readAsDataURL(file);
          }
      }
  }

  function get_gif(filePath,img_id) {
      // 서버로 GET 요청을 보내어 암호화된 파일 경로를 서버로 부터 가져옵니다
      fetch(`/api/getgif?filePath=${encodeURIComponent(filePath)}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('File not found');
              }
              return response.blob(); // 응답을 Blob 형태로 받음
          })
          .then(blob => {
              // 파일을 Blob 객체로 받았으면, 이 Blob을 이미지로 표시
              const imgElement = document.getElementById(img_id);
              const imgUrl = URL.createObjectURL(blob); // Blob을 Object URL로 변환
              imgElement.src = imgUrl; // 이미지 엘리먼트의 src에 URL 설정
              return imgUrl;
          })
          .catch(error => {
              console.error('Error loading file:', error);
          });
  }



  function makeGIF()
  { //서버로 요청 보내서 gif 생성하고 그 경로 가져오기
    const wait_alarm = document.getElementById('waiting');
    wait_alarm.style.display = "block";

    pgndata = document.getElementById('pgndata').value;
    const checkedRadio = document.querySelector('input[name="sideRadios"]:checked');
    let black_bottom_opt = checkedRadio.value;
    let skin_dir = "[";
    for (let i = 0; i <= 12; i++) {
        skin_dir = skin_dir + images[i] + ",";
    }
    skin_dir = skin_dir.slice(0,-1) + "]";

    const checkedSpeed = document.querySelector('input[name="Speeds"]:checked');
    let speed0 = checkedSpeed.value;

    const postData = {
      pgndata: pgndata,
      black_bottom_opt: black_bottom_opt,
      input_link : dir_link + image_link,
      skin_dir : skin_dir,
      delay : speed0
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    };

    fetch('/api/pgntogif', fetchOptions)
      .then(response => response.json())
      .then(data => {
        gif_src = data.output_dir;
        gif_id = data.id;
        showingGifdata(gif_src,gif_id);
      })
      .catch(error =>console.error('Error:', error));
  }

  function showingGifdata(gif_src,gif_id)
  {
    //이미지 클릭시 gif 다운받을 수 있는 환경 구성
     const sample_opt = localStorage.getItem('sample_opt');
     localStorage.setItem('sample_opt', sample_opt + 1);
     localStorage.setItem('sample', gif_src);
     let src0 = gif_src;
     let id0 = gif_id;

     console.log(src0);
     const gif_gallery = document.getElementById('gif_gallery');
       const colDiv = document.createElement('div');
         colDiv.className = 'col-md-4';
         // img 태그 생성
         const imgElement = document.createElement('img');
         imgElement.className = 'img-fluid midium';
         imgElement.alt = id0;
         imgElement.id = id0;
         let src00 = get_gif(src0,id0);
         imgElement.addEventListener('click', () => {
               const link = document.createElement('a');
               let data = imgElement.src;
               link.href = data;
               link.download = 'pgn.gif';  // 원하는 파일 이름document.body.appendChild(link);
               link.click();
               document.body.removeChild(link);
               URL.revokeObjectURL(data);
          });

         const labelDiv = document.createElement('div');
         labelDiv.className = 'label';
         labelDiv.textContent = "gif result";
         // colDiv에 img 태그 추가
         colDiv.appendChild(imgElement);
         colDiv.appendChild(labelDiv);
         // gallery 요소에 colDiv 추가
         gif_gallery.appendChild(colDiv);

         const wait_alarm = document.getElementById('waiting');
         wait_alarm.style.display = "none";
  }





