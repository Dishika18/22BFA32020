"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Link,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Stack,
  Paper,
  LinearProgress,
} from "@mui/material"
import {
  ExpandMore,
  Launch,
  BarChart,
  TrendingUp,
  AccessTime,
  Mouse,
  ContentCopy,
  CheckCircle,
  Cancel,
} from "@mui/icons-material"
import { getAllUrls } from "../utils/storage"

export default function Statistics() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [urls, setUrls] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, totalClicks: 0 })

  useEffect(() => {
    const loadUrls = () => {
      const allUrls = getAllUrls()
      const sortedUrls = allUrls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setUrls(sortedUrls)

      const now = new Date()
      const active = sortedUrls.filter((url) => new Date(url.expiryDate) > now).length
      const expired = sortedUrls.length - active
      const totalClicks = sortedUrls.reduce((sum, url) => sum + (url.clicks || 0), 0)

      setStats({
        total: sortedUrls.length,
        active,
        expired,
        totalClicks,
      })
    }

    loadUrls()
    const interval = setInterval(loadUrls, 5000)
    return () => clearInterval(interval)
  }, [])

  const isExpired = (expiryDate) => {
    return new Date() > new Date(expiryDate)
  }

  const getStatusChip = (url) => {
    if (isExpired(url.expiryDate)) {
      return <Chip label="Expired" color="error" size="small" icon={<Cancel />} />
    }
    return <Chip label="Active" color="success" size="small" icon={<CheckCircle />} />
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (urls.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            URL Statistics
          </Typography>
        </Box>

        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mx: "auto", mb: 3 }}>
              <BarChart sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create some shortened URLs first to see detailed statistics and analytics here.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 400, mx: "auto" }}>
              Start by visiting the URL shortener page to create your first short link!
            </Alert>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
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
          URL Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track performance and analytics for all your shortened URLs
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: "center", bgcolor: "primary.main", color: "primary.contrastText" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2">Total URLs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: "center", bgcolor: "success.main", color: "success.contrastText" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.active}
              </Typography>
              <Typography variant="body2">Active URLs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: "center", bgcolor: "error.main", color: "error.contrastText" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.expired}
              </Typography>
              <Typography variant="body2">Expired URLs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: "center", bgcolor: "secondary.main", color: "secondary.contrastText" }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stats.totalClicks}
              </Typography>
              <Typography variant="body2">Total Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, bgcolor: "grey.50", borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BarChart />
              All Shortened URLs ({urls.length})
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {urls.map((url) => (
              <Accordion
                key={url.id}
                sx={{
                  mb: 2,
                  "&:before": { display: "none" },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderRadius: "12px !important",
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: isExpired(url.expiryDate) ? "error.light" : "success.light",
                    "&:hover": { bgcolor: isExpired(url.expiryDate) ? "error.main" : "success.main" },
                    color: isExpired(url.expiryDate) ? "error.contrastText" : "success.contrastText",
                    minHeight: 72,
                  }}
                >
                  <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "background.paper", color: "text.primary" }}>
                      <TrendingUp />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        /{url.shortcode}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: { xs: 200, sm: 400, md: 600 },
                        }}
                      >
                        {url.originalUrl}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                      <Box sx={{ textAlign: "center", display: { xs: "none", sm: "block" } }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {url.clicks}
                        </Typography>
                        <Typography variant="caption">clicks</Typography>
                      </Box>
                      {getStatusChip(url)}
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Original URL
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Link
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {url.originalUrl}
                            </Link>
                            <Tooltip title="Open original URL">
                              <IconButton size="small" href={url.originalUrl} target="_blank">
                                <Launch fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Shortened URL
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography sx={{ flex: 1 }}>
                              {window.location.origin}/{url.shortcode}
                            </Typography>
                            <Tooltip title="Copy to clipboard">
                              <IconButton
                                size="small"
                                onClick={() => copyToClipboard(`${window.location.origin}/${url.shortcode}`)}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                          <AccessTime color="primary" sx={{ mb: 1 }} />
                          <Typography variant="caption" display="block" color="text.secondary">
                            Created
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {new Date(url.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                          <AccessTime color="warning" sx={{ mb: 1 }} />
                          <Typography variant="caption" display="block" color="text.secondary">
                            Expires
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {new Date(url.expiryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                          <Mouse color="secondary" sx={{ mb: 1 }} />
                          <Typography variant="caption" display="block" color="text.secondary">
                            Total Clicks
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {url.clicks}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                          {isExpired(url.expiryDate) ? (
                            <Cancel color="error" sx={{ mb: 1 }} />
                          ) : (
                            <CheckCircle color="success" sx={{ mb: 1 }} />
                          )}
                          <Typography variant="caption" display="block" color="text.secondary">
                            Status
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {isExpired(url.expiryDate) ? "Expired" : "Active"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {url.clickHistory && url.clickHistory.length > 0 ? (
                      <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BarChart />
                          Click Analytics
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Click Activity
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((url.clicks / 10) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>

                        <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
                          {url.clickHistory.map((click, index) => (
                            <Box key={index}>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: 1,
                                      }}
                                    >
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {new Date(click.timestamp).toLocaleString()}
                                      </Typography>
                                      <Stack direction="row" spacing={1}>
                                        {click.referrer && click.referrer !== "Direct" && (
                                          <Chip
                                            label={`From: ${click.referrer}`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                          />
                                        )}
                                        {click.location && (
                                          <Chip
                                            label={click.location}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                          />
                                        )}
                                      </Stack>
                                    </Box>
                                  }
                                  secondary={
                                    click.userAgent ? (
                                      <Typography variant="caption" color="text.secondary">
                                        {click.userAgent.substring(0, 100)}...
                                      </Typography>
                                    ) : null
                                  }
                                />
                              </ListItem>
                              {index < url.clickHistory.length - 1 && <Divider />}
                            </Box>
                          ))}
                        </List>
                      </Paper>
                    ) : (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Typography variant="body2">
                          No clicks recorded yet for this URL. Share your link to start tracking analytics!
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
