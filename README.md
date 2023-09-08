### Hi there 👋
#Milobeng02@gmail.com
MY name is Aaron Lee

![](https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDoraemon_%2528character%2529&psig=AOvVaw1JIZIlG4x3slw177AB_pUe&ust=1694234171903000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCNjz76GYmoEDFQAAAAAdAAAAABAE)

<div class="slider">
  <img src="image1.jpg" alt="Image 1">
  <img src="image2.jpg" alt="Image 2">
  <img src="image3.jpg" alt="Image 3">
</div>

<script>
  const slider = document.querySelector(".slider");
  let index = 0;

  function changeSlide() {
    index = (index + 1) % slider.children.length;
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  setInterval(changeSlide, 3000); // Auto-advance slides every 3 seconds
</script>



<!--
**Milobeng02/Milobeng02** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
