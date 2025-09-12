function useUser() {
  const { user, setUser } = useStore();
  return { user, setUser };
}

export default useUser;
