import './App.css';
import Excel from './components/Excel/Excel';

function App() {
  const headers = ['Book', 'Author', 'Language', 'Published', 'Sales', 'Genre'];
  const data = [
    [
      'Don Quixote',
      'Miguel de Cervantes',
      'Spanish',
      '1605',
      '500 million',
      'Adventure Fiction',
    ],
    [
      'A Tale of Two Cities',
      'Charles Dickens',
      'English',
      '1859',
      '200 million',
      'Historical fiction',
    ],
    [
      'The Little Prince (Le Petit Prince)',
      'Antoine de Saint-Exupéry',
      'French',
      '1943',
      '200 million',
      'Novella',
    ],
    [
      "Harry Potter and the Philosopher's Stone",
      'J. K. Rowling',
      'English',
      '1997',
      '120 million',
      'Fantasy',
    ],
    [
      'And Then There Were None',
      'Agatha Christie',
      'English',
      '1939',
      '100 million',
      'Mystery',
    ],
    [
      'Dream of the Red Chamber (紅樓夢)',
      'Cao Xueqin',
      'Chinese',
      '1791',
      '100 million',
      'Family saga',
    ],
    [
      'The Hobbit',
      'J. R. R. Tolkien',
      'English',
      '1937',
      '100 million',
      'Fantasy',
    ],
    [
      'The Lion, the Witch and the Wardrobe',
      'C. S. Lewis',
      'English',
      '1950',
      '85 million',
      "Fantasy, Children's fiction",
    ],
  ];

  return (
    <div className='App'>
      <Excel headers={headers} initialData={data} />
    </div>
  );
}

export default App;
