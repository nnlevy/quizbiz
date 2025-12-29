type TrustCapsuleProps = {
  items: string[];
};

const TrustCapsule = ({ items }: TrustCapsuleProps) => (
  <div className="trust-capsule">
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export default TrustCapsule;
