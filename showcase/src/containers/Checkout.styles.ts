import { Styles } from "../../../types/card_options";

export const checkoutContainerStyles = {
  button: {
    backgroundColor: "#39a1f4",
    border: "none",
    borderRadius: "12px",
    color: "#FFF",
    height: "36px",
    margin: "6px 0",
    marginLeft: "15px",
    overflow: "hidden",
    padding: "0 26px"
  },
  contentCheckout: {
    alignItems: "start",
    display: "flex",
    flexDirection: "column" as const,
    padding: "10px"
  },
  contentTitle: {
    display: "flex",
    justifyContent: "center",
    marginRight: "250px",
    width: "100%"
  },
  buttonError: {
    backgroundColor: "red",
    border: "none",
    borderRadius: "12px",
    color: "#FFF",
    height: "36px",
    margin: "6px 0",
    marginLeft: "15px",
    overflow: "hidden",
    padding: "0 26px"
  },
  contentBottoms: {
    display: "flex"
  }
};

export const hostedFieldsStyles: Styles = {
  container: {
    position: "relative",
    "&:focus-within": {
      "& label": {
        background: "white",
        color: "#6D7781",
        fontFamily: "IBM Plex sans-serif",
        fontSize: "12px",
        fontWeight: "400",
        left: "16px",
        paddingLeft: "5px",
        paddingRight: "5px",
        position: "absolute",
        top: "-7px"
      }
    }
  },
  input: {
    border: "1px solid #1E65AE",
    borderRadius: "10px",
    fontFamily: "IBM Plex sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    outline: "none",
    padding: "10px",
    width: "350px",
    "&:focus": {
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontFamily: "IBM Plex sans-serif",
      fontSize: "16px",
      fontWeight: "400",
      outline: "none",
      padding: "10px",
      width: "350px"
    },
    "&:invalid": {
      border: "1px solid #B60000",
      borderRadius: "10px",
      fontFamily: "IBM Plex sans-serif",
      fontSize: "16px",
      fontWeight: "400",
      outline: "none",
      padding: "10px",
      width: "350px"
    }
  },
  label: ".kushki-hosted-field-label",
  select: ".kushki-hosted-field-select",
  deferred: {
    container: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "50%",
      gridTemplateRows: "1fr"
    },
    checkbox: {
      container: {
        position: "relative",
        marginBottom: "20px",
        gridRow: "1",
        gridColumns: "1"
      },
      input: {
        borderRadius: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        width: "18px",
        height: "18px"
      },
      label: {
        background: "white",
        color: "#293036",
        fontFamily: "IBM Plex sans",
        fontWeight: "500",
        paddingLeft: "5px",
        paddingRight: "5px"
      }
    },
    creditType: {
      container: {
        position: "relative",
        marginBottom: "10px",
        gridRow: "2",
        gridColumns: "1"
      }
    },
    months: {
      container: {
        position: "relative",
        width: "175px",
        gridRow: "3",
        gridColumns: "1"
      },
      select: {
        fontFamily: "IBM Plex sans-serif",
        width: "175px",
        padding: "10px",
        outline: "none",
        fontSize: "18px",
        fontWeight: "400",
        borderRadius: "10px",
        border: "1px solid #ccc"
      }
    },
    graceMonths: {
      container: {
        position: "relative",
        width: "175px",
        gridRow: "3",
        gridColumns: "1"
      },
      select: {
        fontFamily: "IBM Plex sans-serif",
        width: "175px",
        padding: "10px",
        outline: "none",
        fontSize: "18px",
        fontWeight: "400",
        borderRadius: "10px",
        border: "1px solid #ccc"
      }
    }
  }
};
