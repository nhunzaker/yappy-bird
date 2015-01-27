class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  sub(vector) {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;

    return this;
  }

  div(n) {
    this.x = this.x / n;
    this.y = this.y / n;

    return this;
  }

  mag() {
    var {x, y} = this;
    return Math.sqrt(x * x + y * y);
  }

  limit(high) {
    if (this.mag() > high) {
      this.normalize();
      this.mult(high);
    }

    return this;
  }

  normalize() {
    var m = this.mag();
    if (m > 0) {
      this.div(m);
    }
    return this;
  }

  static sub (v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }
}

module.exports = Vector;
