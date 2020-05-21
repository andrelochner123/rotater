<template>
  <div class="hello">
      <div> 
     <img id="image" @load="imageLoaded()" hidden ref="img"  alt="Vue logo" src="./../assets/testscreen.png" />
     <canvas id="canvas" ref="canvas"></canvas><br><br>
     
     <button @click="rotate()"> Rotate </button>
     </div>
  </div>
</template>

<script>
import myImage from "./../assets/testscreen.png";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
    ctx: null
  },
  methods: {
    rotate: function() {
      let ctx = this.canvas.getContext("2d");
      var imDat = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      //ctx.fillStyle = 'green';
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let angle_degree = 5;
      let angle_radians = 2 * angle_degree * Math.PI / 360; // angle in radian
      let newData = this.$Rotator.rotate(imDat, angle_radians);
      ctx.putImageData(newData, 0, 0);
    },
    imageLoaded: function() {
      console.log("Image loaded");
      let img = this.$refs.img;
      this.canvas.width = img.width;
      this.canvas.height = img.height;

      let ctx = this.canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
    }
  },
  mounted: function() {
    let cvn = this.$refs.canvas;
    let ctx = cvn.getContext("2d");
    this.canvas = cvn;
    /*let bg = new Image();
        bg.src = myImage;
        bg.onload = function() {
                console.log(bg);
                ctx.width = bg.width;
                ctx.height = bg.height;
                ctx.drawImage(bg, 0 ,0);
        };*/
  },
  created: function() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
