const colors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(234,147,31,1)',
  'rgba(123,123,123,1)',
  'rgba(152, 251, 152, 1)',
  'rgba(187,201,254, 1)',
  'rgba(235,31,32, 1)',
  'rgba(100, 200, 50, 1)',
  'rgba(10, 150, 200, 1)',
  'rgba(200, 100, 150, 1)',
  'rgba(50, 50, 100, 1)',
  'rgba(150, 200, 10, 1)',
  'rgba(200, 50, 100, 1)',
];

export default function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
