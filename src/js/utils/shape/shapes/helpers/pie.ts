type ShapePieOptions = {
  H: number | string;
  w: number | string;
  adj1: number | string;
  adj2: number | string;
  isClose: boolean;
};

export function shapePie({ H, w, adj1, adj2, isClose }: ShapePieOptions): [string, string] {
  const pieVal = typeof adj2 === "number" ? adj2 : parseFloat(adj2);
  const piAngle = typeof adj1 === "number" ? adj1 : parseFloat(adj1);
  const size = typeof H === "number" ? H : parseFloat(H);
  const radius = size / 2;
  let value = pieVal - piAngle;
  if (value < 0) {
    value = 360 + value;
  }
  value = Math.min(Math.max(value, 0), 360);

  //calculate x,y coordinates of the point on the circle to draw the arc to.
  const x = Math.cos((2 * Math.PI) / (360 / value));
  const y = Math.sin((2 * Math.PI) / (360 / value));

  //d is a string that describes the path of the slice.
  if (isClose) {
    const longArc = value <= 180 ? 0 : 1;
    const d =
      "M" +
      radius +
      "," +
      radius +
      " L" +
      radius +
      "," +
      0 +
      " A" +
      radius +
      "," +
      radius +
      " 0 " +
      longArc +
      ",1 " +
      (radius + y * radius) +
      "," +
      (radius - x * radius) +
      " z";
    const rot = "rotate(" + (piAngle - 270) + ", " + radius + ", " + radius + ")";
    return [d, rot];
  } else {
    const longArc = value <= 180 ? 0 : 1;
    const radius1 = radius;
    const radius2 = typeof w === "number" ? w / 2 : parseFloat(w) / 2;
    const d =
      "M" +
      radius1 +
      "," +
      0 +
      " A" +
      radius2 +
      "," +
      radius1 +
      " 0 " +
      longArc +
      ",1 " +
      (radius2 + y * radius2) +
      "," +
      (radius1 - x * radius1);
    const rot = "rotate(" + (piAngle + 90) + ", " + radius + ", " + radius + ")";
    return [d, rot];
  }
}
