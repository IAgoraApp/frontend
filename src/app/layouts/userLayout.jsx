import AppLayout from './appLayout';

export default function UserLayout({
  userType = 'userA',
  headerProps,
  ...props
}) {
  return (
    <AppLayout
      {...props}
      headerVariant='user'
      headerProps={{ ...headerProps, userType }}
    />
  );
}
