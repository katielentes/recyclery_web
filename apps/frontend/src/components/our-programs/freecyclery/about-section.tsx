import { Link } from 'react-router-dom';
import squigglyLine from '../../../assets/images/our-programs/freecyclery/squiggly-line.svg';
import { Button } from '../../../components/generic/buttons.tsx';
import { useUser } from '../../../hooks/useUser.tsx';
import { EditLink } from '../../generic/edit-image-button.js';
import { H2, Section } from '../../generic/styled-tags.tsx';

export default function AboutSection({ imageURL }: { imageURL?: string }) {
  const { isAuthenticated } = useUser();

  return (
    <Section className="lg:py-0 lg:grid lg:grid-cols-2 gap-24 items-center justify-items-center">
      <div>
        <H2>about our program</H2>
        {/* <p className="text-body2 font-brandon">
          We work with local social service agencies to connect people in need with a free bike that
          was serviced by volunteer mechanics and checked over by a Recyclery mechanic.
        </p> */}
        <div className="space-y-4">
          <p className="text-body2 font-brandon">
            Donated bikes are repaired by volunteer mechanics and donated to those in need in our
            community through our partner organizations.{' '}
          </p>
          <p className="text-body2 font-brandon">
            Donate today and help provide new locks and helmets to Freecyclery recipients. $50
            provides one lock and helmet set.
          </p>
          <Button color="orange">
            <Link to="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=97B48AH3ZT92G">
              Donate
            </Link>
          </Button>
          <div className="">
            <p className="text-body2 font-brandon underline">HOURS:</p>
            <p className="text-body2 font-brandon">Mondays 12-3pm</p>
            <p className="text-body2 font-brandon">Wednesdays 6-8pm</p>
            <p className="text-body2 font-brandon">Thursday 10am-1pm</p>
            <p className="text-body2 font-brandon">Sundays 1pm -3pm</p>
          </div>
        </div>
      </div>
      <div className="lg:relative w-full lg:h-[30rem] mt-8 lg:mt-0 flex justify-center">
        <img
          src={squigglyLine}
          alt="squiggly line"
          className="hidden lg:block h-[30rem] absolute left-[50%] translate-x-[-50%] z-0"
        />

        <img
          src={imageURL}
          alt="woman holding a bike"
          className="rounded-xl h-[20rem] lg:absolute lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[5rem] lg:z-10"
        />
        {/* putting the EditLink button component in this aboutsection component was the cleanest way to visually add the button */}
        {isAuthenticated && <EditLink id="8" className="mt-10"></EditLink>}
      </div>
    </Section>
  );
}
