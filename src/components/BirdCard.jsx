{/*this fucntion receives 2 props: bird containing the info about a single bird: name, image, desc & onClick, a function that runs when card is clicked*/}
{/*BirdCard doesn't know what onClick does, it just calls it*/}
{/*onClick inside the function is receiving onClick as a prop*/}
function BirdCard({ bird, onClick }) {
  return (
    <div className="bird-card" onClick={onClick}> {/*onClick is attached to the div now*/}
      <img 
        src={bird.image} 
        alt={bird.name}
      />
      <div className="card-body">
        <h5 className="card-title">{bird.name}</h5>
        <p className="card-text">{bird.description}</p>
      </div>
      <div className="card-footer bg-white border-top-0">   
        <small className="text-muted">Haz clic para ver más detalles</small>
      </div>
    </div>
  );
}
export default BirdCard;

