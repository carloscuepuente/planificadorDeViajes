// import { useNavigate } from 'react-router-dom';

function ErrorPage() {
  // const navigate = useNavigate();

  return (
    <div className="text-center p-auto mt-20">
      <h1 className="text-2xl font-bold">Ups! La fastidiamos en algo.</h1>
      <img
        src="https://media1.tenor.com/m/VojtJJKAzsIAAAAd/travolta-aerolineas-argentinas-aerolineas-argentinas.gif"
        alt="Confused John Travolta with plane behind"
        className="mx-auto my-4 w-72 h-auto rounded-lg"
      />
    </div>
  );
}

export default ErrorPage;
