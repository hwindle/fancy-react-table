import './App.css';
import Excel from './components/Excel/Excel';

function App() {
  const headers = ['Brand', 'Yarn Name', 'Fibre', 'Weight', 'Metres per 50g', 'Colour'];
  const data = [
    [
      'Cygnet',
      'Simply DK',
      'Acrylic',
      'DK',
      '145',
      'Ruby red',
    ],
    [
      'Rowan',
      'SoftYak',
      'Cotton, yak',
      'DK',
      '135',
      'Mauve',
    ],
    [
      'Rowan',
      'Brushed Fleece',
      'Wool, alpaca',
      'Chunky',
      '150',
      'Cerise',
    ],
    [
      'The Yarn Collective',
      'Portland Lace',
      'Merino wool',
      'Lace',
      '430',
      'Grey',
    ],
    [
      'The Yarn Collective',
      'Portland Lace',
      'Merino wool',
      'Lace',
      '430',
      'Black',
    ],
    [
      'Milla Mia',
      'Naturally soft sock',
      'Wool, nylon',
      '4ply',
      '200',
      'Coral',
    ],
    [
      'Debbie Bliss',
      'Toast',
      'Wool, cashmere',
      '4ply',
      '200',
      'Pale pink',
    ],
    [
      'Debbie Bliss',
      'Rialto Lace',
      'Merino wool',
      'Lace',
      '400',
      "Mid blue",
    ],
  ];

  return (
    <div className='App'>
      <Excel headers={headers} initialData={data} />
    </div>
  );
}

export default App;
