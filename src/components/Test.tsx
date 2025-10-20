import { Button } from "./ui/button";

const Test = () => {
  console.log('Rendering Test component');
  
  const handleClick = () => {
    console.log('Button clicked!');
    alert('Button works!');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Button 
        variant="hero" 
        size="lg"
        onClick={handleClick}
        className="px-8 py-4 text-lg font-semibold"
      >
        Test Button
      </Button>
    </div>
  );
};

export default Test;