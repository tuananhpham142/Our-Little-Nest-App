import type { PropsWithChildren } from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SafeScreen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[]}>
      <StatusBar />
      {children}
    </View>
  );
}

export default SafeScreen;
