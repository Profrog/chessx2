    let image_alt = '';
      // 이미지 클릭 시 호출되는 함수
      function handleImageClick(imageElement) {
          //alt 속성의 값을 가져와서 변수에 저장
          image_alt = imageElement.getAttribute('alt');
          localStorage.setItem('skin_data', image_alt);
          window.location.href = "/ptg";
          console.log('Selected Image Alt:', selectedImageAlt);
          alert('Selected Image Alt: ' + selectedImageAlt);
      }




