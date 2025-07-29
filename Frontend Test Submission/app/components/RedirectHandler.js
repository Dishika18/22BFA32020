"use client"

import { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import {
  Container,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
} from "@mui/material"
import { Launch, Error as ErrorIcon, Schedule, Home } from "@mui/icons-material"
import { getUrlByShortcode, updateClickCount } from "../utils/storage"

export default function RedirectHandler() {
  const { shortcode } = useParams()
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(3)
  const [urlData, setUrlData] = useState(null)

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const data = getUrlByShortcode(shortcode)

        if (!data) {
          setStatus("error")
          setError("Short URL not found")
          return
        }

        setUrlData(data)

        if (new Date() > new Date(data.expiryDate)) {
          setStatus("expired")
          setError("This short URL has expired")
          return
        }

        const clickData = {
          timestamp: new Date(),
          referrer: document.referrer || "Direct",
          userAgent: navigator.userAgent,
          location: "Unknown",
        }

        updateClickCount(shortcode, clickData)
        setStatus("redirecting")

        // Countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              window.location.href = data.originalUrl
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (err) {
        setStatus("error")
        setError("An error occurred while processing the redirect")
      }
    }

    if (shortcode) {
      handleRedirect()
    }
  }, [shortcode])

  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ textAlign: "center", p: 4 }}>
          <CardContent>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              Processing your request...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we verify the link
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (status === "redirecting") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ textAlign: "center", p: 4 }}>
          <CardContent>
            <Avatar sx={{ bgcolor: "success.main", width: 80, height: 80, mx: "auto", mb: 3 }}>
              <Launch sx={{ fontSize: 40 }} />
            </Avatar>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Redirecting in {countdown}...
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Taking you to: {urlData?.originalUrl}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={((3 - countdown) / 3) * 100}
              sx={{ mb: 3, height: 8, borderRadius: 4 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If you are not redirected automatically, click the button below
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<Launch />}
              onClick={() => (window.location.href = urlData?.originalUrl)}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              Go to Destination
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (status === "error" || status === "expired") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ textAlign: "center", p: 4 }}>
          <CardContent>
            <Avatar sx={{ bgcolor: "error.main", width: 80, height: 80, mx: "auto", mb: 3 }}>
              {status === "expired" ? <Schedule sx={{ fontSize: 40 }} /> : <ErrorIcon sx={{ fontSize: 40 }} />}
            </Avatar>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {status === "expired" ? "Link Expired" : "Link Not Found"}
            </Typography>

            <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
              {error}
            </Alert>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {status === "expired"
                ? "This shortened URL has passed its expiration date and is no longer valid."
                : "The shortened URL you're looking for doesn't exist or may have been removed."}
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              href="/"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              Create New Short URL
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return <Navigate to="/" replace />
}
