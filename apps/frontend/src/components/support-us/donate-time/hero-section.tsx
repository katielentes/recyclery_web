import { Link } from 'react-router-dom';
import { BgImage } from '../../generic/bg-image.tsx';
import { Button } from '../../generic/buttons.tsx';
import { H1 } from '../../generic/styled-tags.tsx';

function HeroSection({ image }: { image?: string }) {
  return (
    <BgImage image={image} className="min-h-[32rem]">
      <H1 className="mb-6">volunteer at the recyclery</H1>
      <div className="flex gap-4">
        <Button color="orange">
          <Link to="https://www.volgistics.com/vicnet/623282/login">Volunteer Portal</Link>
        </Button>
        <Button color="orange">
          <Link to="https://www.volgistics.com/appform/1124825310">Volunteer Application</Link>
        </Button>
      </div>
    </BgImage>
  );
}

export default HeroSection;
