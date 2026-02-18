import { Link } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser.tsx';
import { Button } from '../../generic/buttons.tsx';
import { EditLink } from '../../generic/edit-image-button.js';
import { H2, Section } from '../../generic/styled-tags.tsx';

function VolunteerMission({ image }: { image?: string }) {
  const { isAuthenticated } = useUser();

  return (
    <Section className="lg:grid lg:grid-cols-2 gap-24 items-center justify-items-center" tan>
      <div>
        <H2>volunteers and our mission</H2>
        <p className="font-brandon mb-4">
          Recyclery volunteers are the heart and soul of the work of the Recyclery. As a volunteer,
          you actively rescue bikes from the landfill and transform them into sustainable
          transportation for those in need through our Freecyclery program and beyond! Volunteers
          learn to repair bikes for donation, sell bikes to the community, assist with repairs at
          Open Shop, and help in so many ways. All levels of mechanical experience are welcome, and
          we encourage you to use your prior skills and life experience to help power our mission &
          vision of sustainability and resilience in our neighborhood.
        </p>
        <p className="font-brandon mb-4">
          We are thankful to our volunteers who transform lives by embodying our mission. Their hard
          work and dedication will make a difference in our neighborhood and the lives of those we
          serve and support.
        </p>
        <Button>
          <Link to="https://www.volgistics.com/appform/1124825310">Join the Recyclery Today!</Link>
        </Button>
      </div>
      <div>
        <img
          src={image}
          alt="a volunteer helping someone fix a bike"
          className="rounded-xl w-72 lg:w-96 mt-16 lg:mt-0"
        />
        {isAuthenticated && <EditLink id="16"></EditLink>}
      </div>
    </Section>
  );
}

export default VolunteerMission;
