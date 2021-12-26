import React from "react";
import { ScrollView, Text } from "react-native";

import * as Sentry from "@sentry/react-native";

const getTestProps = (id) =>
  Platform.OS === "android"
    ? {
        accessibilityLabel: id,
        accessible: true,
      }
    : {
        testID: id,
      };

Sentry.init({
  // Replace the example DSN below with your own DSN:
  dsn:
    "https://d870ad989e7046a8b9715a57f59b23b5@o447951.ingest.sentry.io/5428561",
  debug: true,
});

/**
 * This screen is for internal end-to-end testing purposes only. Do not use.
 * Not visible through the UI (no button to load it).
 */
const App = () => {
  const [eventId, setEventId] = React.useState(null);

  // !!! WARNING: Do not put Sentry.init inside React.useEffect like we do here. This is only for testing purposes.
  // We only do this to render the eventId onto the UI for end to end tests.
  React.useEffect(() => {
    Sentry.init({
      dsn: SENTRY_INTERNAL_DSN,
      beforeSend: (e) => {
        setEventId(e.event_id);
        return e;
      },
    });
  }, []);

  return (
    <ScrollView>
      <Text {...getTestProps("eventId")}>{eventId}</Text>
      <Text {...getTestProps("clearEventId")} onPress={() => setEventId("")}>
        Clear Event Id
      </Text>
      <Text
        {...getTestProps("captureMessage")}
        onPress={() => {
          Sentry.captureMessage("React Native Test Message");
        }}
      >
        captureMessage
      </Text>
      <Text
        {...getTestProps("captureException")}
        onPress={() => {
          Sentry.captureException(new Error("captureException test"));
        }}
      >
        captureException
      </Text>
      <Text
        {...getTestProps("throwNewError")}
        onPress={() => {
          throw new Error("throw new error test");
        }}
      >
        throw new Error
      </Text>
      <Text
        onPress={() => {
          new Promise(() => {
            throw new Error("Unhandled Promise Rejection");
          });
        }}
        {...getTestProps("unhandledPromiseRejection")}
      >
        Unhandled Promise Rejection
      </Text>
      <Text
        {...getTestProps("close")}
        onPress={() => {
          Sentry.close();
        }}
      >
        close
      </Text>
      <Text
        onPress={() => {
          Sentry.nativeCrash();
        }}
      >
        nativeCrash
      </Text>
    </ScrollView>
  );
};

export default App;