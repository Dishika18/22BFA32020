"use client"

import { useState } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  Tooltip,
  Snackbar,
} from "@mui/material"
import { Add, Delete, ContentCopy, Link as LinkIcon, Schedule, Code, CheckCircle, Launch } from "@mui/icons-material"
import { validateUrl, validateShortcode, generateShortcode } from "../utils/validation"
import { saveUrlData, getAllUrls } from "../utils/storage"

export default function UrlShortener() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [entries, setEntries] = useState([{ id: 1, url: "", validity: 30, shortcode: "", error: "" }])
  const [results, setResults] = useState([])
  const [globalError, setGlobalError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "" })

  const addEntry = () => {
    if (entries.length < 5) {
      const newId = Math.max(...entries.map((e) => e.id)) + 1
      setEntries([...entries, { id: newId, url: "", validity: 30, shortcode: "", error: "" }])
    }
  }

  const removeEntry = (id) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id))
    }
  }

  const updateEntry = (id, field, value) => {
    setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value, error: "" } : entry)))
    setGlobalError("")
  }

  const validateEntry = (entry) => {
    if (!entry.url.trim()) {
      return "URL is required"
    }

    if (!validateUrl(entry.url)) {
      return "Please enter a valid URL"
    }

    if (entry.validity && (isNaN(entry.validity) || entry.validity <= 0)) {
      return "Validity must be a positive number"
    }

    if (entry.shortcode && !validateShortcode(entry.shortcode)) {
      return "Shortcode must be alphanumeric and max 10 characters"
    }

    const existingUrls = getAllUrls()
    if (entry.shortcode && existingUrls.some((url) => url.shortcode === entry.shortcode)) {
      return "Shortcode already in use"
    }

    return null
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setGlobalError("")

    const validatedEntries = entries.map((entry) => ({
      ...entry,
      error: validateEntry(entry),
    }))

    setEntries(validatedEntries)

    const hasErrors = validatedEntries.some((entry) => entry.error)
    if (hasErrors) {
      setIsSubmitting(false)
      return
    }

    const shortcodes = validatedEntries.map((entry) => entry.shortcode).filter((code) => code.trim())
    const duplicates = shortcodes.filter((code, index) => shortcodes.indexOf(code) !== index)
    if (duplicates.length > 0) {
      setGlobalError("Duplicate shortcodes found in current entries")
      setIsSubmitting(false)
      return
    }

    const newResults = validatedEntries.map((entry) => {
      const shortcode = entry.shortcode || generateShortcode()
      const validity = entry.validity || 30
      const expiryDate = new Date(Date.now() + validity * 60 * 1000)

      const urlData = {
        id: Date.now() + Math.random(),
        originalUrl: entry.url,
        shortcode,
        createdAt: new Date(),
        expiryDate,
        clicks: 0,
        clickHistory: [],
      }

      saveUrlData(urlData)

      return {
        originalUrl: entry.url,
        shortUrl: `${window.location.origin}/${shortcode}`,
        expiryDate: expiryDate.toLocaleString(),
        shortcode,
      }
    })

    setResults(newResults)
    setEntries([{ id: 1, url: "", validity: 30, shortcode: "", error: "" }])
    setIsSubmitting(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setSnackbar({ open: true, message: "Copied to clipboard!" })
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          Shorten Your URLs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
          Transform long URLs into short, shareable links. Track clicks, set expiry dates, and create custom shortcodes
          - all in one powerful tool.
        </Typography>
      </Box>

      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
              <LinkIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                Create Short Links
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add up to 5 URLs at once with custom settings
              </Typography>
            </Box>
          </Box>

          {globalError && (
            <Fade in={!!globalError}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {globalError}
              </Alert>
            </Fade>
          )}

          <Stack spacing={3}>
            {entries.map((entry, index) => (
              <Slide key={entry.id} direction="up" in={true} timeout={300 + index * 100}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    background: index % 2 === 0 ? "rgba(102, 126, 234, 0.02)" : "rgba(245, 158, 11, 0.02)",
                    border: "1px solid",
                    borderColor: index % 2 === 0 ? "rgba(102, 126, 234, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  }}
                >
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Original URL"
                        placeholder="https://example.com/very-long-url-that-needs-shortening"
                        value={entry.url}
                        onChange={(e) => updateEntry(entry.id, "url", e.target.value)}
                        error={!!entry.error}
                        helperText={entry.error}
                        InputProps={{
                          startAdornment: <LinkIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Validity Period"
                        type="number"
                        placeholder="30"
                        value={entry.validity}
                        onChange={(e) => updateEntry(entry.id, "validity", Number.parseInt(e.target.value) || "")}
                        InputProps={{
                          startAdornment: <Schedule sx={{ mr: 1, color: "text.secondary" }} />,
                          endAdornment: (
                            <Typography variant="body2" color="text.secondary">
                              minutes
                            </Typography>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Custom Shortcode (Optional)"
                        placeholder="mylink123"
                        value={entry.shortcode}
                        onChange={(e) => updateEntry(entry.id, "shortcode", e.target.value)}
                        InputProps={{
                          startAdornment: <Code sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        {entries.length > 1 && (
                          <Tooltip title="Remove this entry">
                            <IconButton
                              onClick={() => removeEntry(entry.id)}
                              color="error"
                              size="small"
                              sx={{
                                bgcolor: "error.light",
                                color: "error.contrastText",
                                "&:hover": { bgcolor: "error.main" },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {index === entries.length - 1 && entries.length < 5 && (
                          <Tooltip title="Add another URL">
                            <IconButton
                              onClick={addEntry}
                              color="primary"
                              size="small"
                              sx={{
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                "&:hover": { bgcolor: "primary.main" },
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Slide>
            ))}
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                minWidth: { xs: "100%", sm: 250 },
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {isSubmitting ? "Processing..." : "Shorten URLs"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Fade in={results.length > 0} timeout={500}>
          <Card sx={{ overflow: "hidden" }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, bgcolor: "primary.main", color: "primary.contrastText" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle sx={{ mr: 2 }} />
                  <Typography variant="h6">Successfully Shortened URLs</Typography>
                </Box>
              </Box>

              {isMobile ? (
                <Stack spacing={2} sx={{ p: 3 }}>
                  {results.map((result, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Original URL
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            wordBreak: "break-all",
                            color: "primary.main",
                          }}
                        >
                          {result.originalUrl}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Shortened URL
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Chip
                            label={result.shortUrl}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ maxWidth: "70%" }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(result.shortUrl)}
                            sx={{ bgcolor: "primary.light" }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => window.open(result.shortUrl, "_blank")}
                            sx={{ bgcolor: "secondary.light" }}
                          >
                            <Launch fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Expires At
                        </Typography>
                        <Typography variant="body2">{result.expiryDate}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Original URL</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Shortened URL</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Expires At</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: "primary.main",
                              }}
                            >
                              {result.originalUrl}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={`/${result.shortcode}`} color="primary" variant="outlined" size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{result.expiryDate}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="Copy to clipboard">
                                <IconButton
                                  size="small"
                                  onClick={() => copyToClipboard(result.shortUrl)}
                                  sx={{ bgcolor: "primary.light" }}
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Open link">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(result.shortUrl, "_blank")}
                                  sx={{ bgcolor: "secondary.light" }}
                                >
                                  <Launch fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Fade>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
  )
}
